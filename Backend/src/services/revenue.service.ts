import mongoose from "mongoose";
import { Booking } from "../modules/bookings/booking.model.js";
import { Boat } from "../modules/boats/boat.model.js";
import { Schedule } from "../modules/schedules/schedule.model.js";
import { Slot } from "../modules/slots/slot.model.js";

export interface RevenueFilter {
  ownerId?: string | mongoose.Types.ObjectId | any;
  boatId?: string | mongoose.Types.ObjectId | any;
  cityId?: string | mongoose.Types.ObjectId | any;
  startDate?: Date;
  endDate?: Date;
  year?: number;
  month?: number; // 0-indexed (0 for Jan, 11 for Dec)
}

export class RevenueService {
  /**
   * Centralized revenue calculation system.
   * Filters bookings and aggregates revenue details.
   */
  public static async calculateRevenue(filter: RevenueFilter) {
    let matchQuery: any = {};

    // 1. Resolve boat-related slot filters to optimize MongoDB index usage
    let boatIds: any[] = [];
    if (filter.boatId) {
      boatIds = [new mongoose.Types.ObjectId(filter.boatId)];
    } else if (filter.ownerId) {
      const boats = await Boat.find({ ownerId: filter.ownerId }).select("_id");
      boatIds = boats.map((b) => b._id);
    } else if (filter.cityId) {
      const boats = await Boat.find({ cityId: filter.cityId }).select("_id");
      boatIds = boats.map((b) => b._id);
    }

    if (filter.boatId || filter.ownerId || filter.cityId) {
      if (boatIds.length === 0) {
        return this.getEmptyRevenueResponse();
      }
      const schedules = await Schedule.find({ boatId: { $in: boatIds } }).select("_id");
      const scheduleIds = schedules.map((s) => s._id);
      const slots = await Slot.find({ scheduleId: { $in: scheduleIds } }).select("_id");
      const slotIds = slots.map((s) => s._id);
      matchQuery.slotId = { $in: slotIds };
    }

    // 2. Date Range filters
    if (filter.startDate || filter.endDate) {
      matchQuery.createdAt = {};
      if (filter.startDate) matchQuery.createdAt.$gte = filter.startDate;
      if (filter.endDate) matchQuery.createdAt.$lte = filter.endDate;
    } else if (filter.year !== undefined) {
      const startYear = Number(filter.year);
      if (filter.month !== undefined && filter.month >= 0 && filter.month <= 11) {
        const start = new Date(Date.UTC(startYear, filter.month, 1, 0, 0, 0, 0));
        const end = new Date(Date.UTC(startYear, filter.month + 1, 0, 23, 59, 59, 999));
        matchQuery.createdAt = { $gte: start, $lte: end };
      } else {
        const start = new Date(Date.UTC(startYear, 0, 1, 0, 0, 0, 0));
        const end = new Date(Date.UTC(startYear, 11, 31, 23, 59, 59, 999));
        matchQuery.createdAt = { $gte: start, $lte: end };
      }
    }

    // 3. Centralized MongoDB Aggregation Pipeline
    const aggregates = await Booking.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "slots",
          localField: "slotId",
          foreignField: "_id",
          as: "slotDetails"
        }
      },
      { $unwind: "$slotDetails" },
      {
        $lookup: {
          from: "schedules",
          localField: "slotDetails.scheduleId",
          foreignField: "_id",
          as: "scheduleDetails"
        }
      },
      { $unwind: "$scheduleDetails" },
      {
        $lookup: {
          from: "boats",
          localField: "scheduleDetails.boatId",
          foreignField: "_id",
          as: "boatDetails"
        }
      },
      { $unwind: "$boatDetails" },
      {
        $lookup: {
          from: "routes",
          localField: "scheduleDetails.routeId",
          foreignField: "_id",
          as: "routeDetails"
        }
      },
      { $unwind: "$routeDetails" },
      {
        $lookup: {
          from: "ghats",
          localField: "routeDetails.sourceGhatId",
          foreignField: "_id",
          as: "sourceGhat"
        }
      },
      { $unwind: { path: "$sourceGhat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "ghats",
          localField: "routeDetails.destinationGhatId",
          foreignField: "_id",
          as: "destGhat"
        }
      },
      { $unwind: { path: "$destGhat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "cities",
          localField: "boatDetails.cityId",
          foreignField: "_id",
          as: "cityDetails"
        }
      },
      { $unwind: { path: "$cityDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "boatDetails.ownerId",
          foreignField: "_id",
          as: "ownerDetails"
        }
      },
      { $unwind: { path: "$ownerDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "bookingId",
          as: "paymentDetails"
        }
      },
      { $unwind: { path: "$paymentDetails", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                grossRevenue: {
                  $sum: {
                    $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$totalAmount", 0]
                  }
                },
                refundAmount: {
                  $sum: {
                    $cond: [
                      { $in: ["$refundStatus", ["COMPLETED", "APPROVED"]] },
                      "$refundAmount",
                      0
                    ]
                  }
                },
                cancelledAmount: {
                  $sum: {
                    $cond: [{ $eq: ["$bookingStatus", "CANCELLED"] }, "$totalAmount", 0]
                  }
                },
                bookingCount: { $sum: 1 },
                completedTrips: {
                  $sum: {
                    $cond: [{ $eq: ["$bookingStatus", "COMPLETED"] }, 1, 0]
                  }
                },
                onlineRevenue: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$bookingStatus", "COMPLETED"] },
                          { $eq: ["$paymentStatus", "PAID"] },
                          { $eq: ["$bookingType", "ONLINE"] }
                        ]
                      },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                offlineRevenue: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$bookingStatus", "COMPLETED"] },
                          { $eq: ["$paymentStatus", "PAID"] },
                          { $eq: ["$bookingType", "OFFLINE"] }
                        ]
                      },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                emergencyRevenue: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$bookingStatus", "COMPLETED"] },
                          { $eq: ["$paymentStatus", "PAID"] },
                          { $eq: ["$bookingType", "EMERGENCY"] }
                        ]
                      },
                      "$totalAmount",
                      0
                    ]
                  }
                }
              }
            }
          ],
          byDate: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                grossRevenue: {
                  $sum: {
                    $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$totalAmount", 0]
                  }
                },
                refundAmount: {
                  $sum: {
                    $cond: [
                      { $in: ["$refundStatus", ["COMPLETED", "APPROVED"]] },
                      "$refundAmount",
                      0
                    ]
                  }
                },
                bookings: { $sum: 1 },
                completedTrips: {
                  $sum: {
                    $cond: [{ $eq: ["$bookingStatus", "COMPLETED"] }, 1, 0]
                  }
                },
                onlineRevenue: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$bookingStatus", "COMPLETED"] },
                          { $eq: ["$paymentStatus", "PAID"] },
                          { $eq: ["$bookingType", "ONLINE"] }
                        ]
                      },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                offlineRevenue: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$bookingStatus", "COMPLETED"] },
                          { $eq: ["$paymentStatus", "PAID"] },
                          { $eq: ["$bookingType", "OFFLINE"] }
                        ]
                      },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                upiCollection: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$bookingStatus", "COMPLETED"] },
                          { $eq: ["$paymentStatus", "PAID"] },
                          { $eq: ["$paymentDetails.paymentMethod", "UPI"] }
                        ]
                      },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                cashCollection: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$bookingStatus", "COMPLETED"] },
                          { $eq: ["$paymentStatus", "PAID"] },
                          { $eq: ["$paymentDetails.paymentMethod", "CASH"] }
                        ]
                      },
                      "$totalAmount",
                      0
                    ]
                  }
                }
              }
            },
            { $sort: { _id: 1 } }
          ],
          byMonth: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                revenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                bookings: { $sum: 1 },
                refunds: {
                  $sum: {
                    $cond: [
                      { $in: ["$refundStatus", ["COMPLETED", "APPROVED"]] },
                      "$refundAmount",
                      0
                    ]
                  }
                }
              }
            },
            { $sort: { _id: 1 } }
          ],
          byBoat: [
            {
              $group: {
                _id: "$boatDetails._id",
                boatName: { $first: "$boatDetails.boatName" },
                boatNumber: { $first: "$boatDetails.boatNumber" },
                ownerName: { $first: "$ownerDetails.name" },
                revenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                bookings: { $sum: 1 }
              }
            },
            { $sort: { revenue: -1 } }
          ],
          byRoute: [
            {
              $group: {
                _id: "$routeDetails._id",
                routeName: {
                  $first: {
                    $concat: [
                      "$sourceGhat.name",
                      " to ",
                      "$destGhat.name"
                    ]
                  }
                },
                revenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                bookings: { $sum: 1 }
              }
            },
            { $sort: { revenue: -1 } }
          ],
          byCity: [
            {
              $group: {
                _id: "$cityDetails._id",
                cityName: { $first: "$cityDetails.name" },
                revenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                bookings: { $sum: 1 }
              }
            },
            { $sort: { revenue: -1 } }
          ],
          byOwner: [
            {
              $group: {
                _id: "$ownerDetails._id",
                ownerName: { $first: "$ownerDetails.name" },
                revenue: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                },
                bookings: { $sum: 1 }
              }
            },
            { $sort: { revenue: -1 } }
          ],
          byPaymentMethod: [
            {
              $group: {
                _id: { $ifNull: ["$paymentDetails.paymentMethod", "UPI"] },
                value: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ["$bookingStatus", "COMPLETED"] }, { $eq: ["$paymentStatus", "PAID"] }] },
                      "$totalAmount",
                      0
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    const result = aggregates[0] || {};
    const sumData = result.summary?.[0] || {
      totalRevenue: 0,
      grossRevenue: 0,
      refundAmount: 0,
      cancelledAmount: 0,
      bookingCount: 0,
      completedTrips: 0,
      onlineRevenue: 0,
      offlineRevenue: 0,
      emergencyRevenue: 0
    };

    // 4. Relative date ranges calculations in local IST timezone
    const now = new Date();
    const getISTDateStr = (date: Date) => {
      return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    };

    const todayStr = getISTDateStr(now);
    const yesterdayStr = getISTDateStr(new Date(now.getTime() - 24 * 60 * 60 * 1000));

    // Determine week dates
    const getWeekDaysStr = (offsetWeeks: number) => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day - (7 * offsetWeeks);
      const start = new Date(today.setDate(diff));
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(getISTDateStr(new Date(start.getTime() + i * 24 * 60 * 60 * 1000)));
      }
      return days;
    };

    const thisWeekDays = getWeekDaysStr(0);
    const lastWeekDays = getWeekDaysStr(1);

    const thisMonthPrefix = todayStr.substring(0, 7);
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthPrefix = getISTDateStr(prevMonthDate).substring(0, 7);

    const thisYearPrefix = todayStr.substring(0, 4);

    let todayRevenue = 0;
    let yesterdayRevenue = 0;
    let thisWeekRevenue = 0;
    let lastWeekRevenue = 0;
    let thisMonthRevenue = 0;
    let prevMonthRevenue = 0;
    let thisYearRevenue = 0;

    // Staff shift specific collections
    let todayCollection = 0;
    let shiftCollection = 0;
    let offlineCollection = 0;
    let cashCollection = 0;
    let upiCollection = 0;
    let completedTripsCount = 0;

    const dailyStats = result.byDate || [];
    dailyStats.forEach((day: any) => {
      const dateKey = day._id;
      const amt = day.revenue;

      if (dateKey === todayStr) {
        todayRevenue += amt;
        todayCollection += day.grossRevenue;
        shiftCollection += day.grossRevenue;
        offlineCollection += day.offlineRevenue;
        cashCollection += day.cashCollection;
        upiCollection += day.upiCollection;
        completedTripsCount += day.completedTrips;
      }
      if (dateKey === yesterdayStr) yesterdayRevenue += amt;
      if (thisWeekDays.includes(dateKey)) thisWeekRevenue += amt;
      if (lastWeekDays.includes(dateKey)) lastWeekRevenue += amt;
      if (dateKey.startsWith(thisMonthPrefix)) thisMonthRevenue += amt;
      if (dateKey.startsWith(prevMonthPrefix)) prevMonthRevenue += amt;
      if (dateKey.startsWith(thisYearPrefix)) thisYearRevenue += amt;
    });

    const totalRevenue = sumData.totalRevenue || 0;
    const grossRevenue = sumData.grossRevenue || 0;
    const refundAmount = sumData.refundAmount || 0;
    const netRevenue = Math.max(grossRevenue - refundAmount, 0);

    const avgTicketSize = sumData.completedTrips > 0
      ? Math.round(totalRevenue / sumData.completedTrips)
      : 0;

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const monthGrowth = calculateGrowth(thisMonthRevenue, prevMonthRevenue);
    const weekGrowth = calculateGrowth(thisWeekRevenue, lastWeekRevenue);

    // Format chart structures
    const formattedDaily = dailyStats.map((d: any) => {
      const parts = d._id.split("-");
      const dayLabel = `${parts[2]} ${new Date(d._id).toLocaleString("en-IN", { month: "short" })}`;
      return {
        date: dayLabel,
        earnings: d.revenue,
        revenue: d.revenue,
        bookings: d.bookings
      };
    });

    const formattedMonthly = (result.byMonth || []).map((m: any) => {
      const parts = m._id.split("-");
      const monthLabel = new Date(Number(parts[0]), Number(parts[1]) - 1, 1).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit"
      });
      return {
        month: monthLabel,
        rawMonth: m._id,
        revenue: m.revenue,
        bookings: m.bookings,
        refunds: m.refunds
      };
    });

    // Populate comparisons
    const quarterly = this.getQuarterlySummary(formattedMonthly);
    const monthlyComparison = this.getMonthlyComparison(formattedMonthly);

    return {
      summary: {
        totalRevenue,
        todayRevenue,
        yesterdayRevenue,
        thisWeekRevenue,
        lastWeekRevenue,
        thisMonthRevenue,
        prevMonthRevenue,
        thisYearRevenue,
        lifetimeRevenue: totalRevenue,
        grossRevenue,
        netRevenue,
        refundAmount,
        cancelledAmount: sumData.cancelledAmount || 0,
        bookingCount: sumData.bookingCount || 0,
        completedTrips: sumData.completedTrips || 0,
        averageTicketSize: avgTicketSize,
        onlineRevenue: sumData.onlineRevenue || 0,
        offlineRevenue: sumData.offlineRevenue || 0,
        emergencyRevenue: sumData.emergencyRevenue || 0,
        todayCollection,
        shiftCollection,
        offlineCollection,
        cashCollection,
        upiCollection,
        completedTripsCount,
        monthGrowth,
        weekGrowth
      },
      charts: {
        dailyRevenue: formattedDaily,
        monthlyRevenue: formattedMonthly,
        paymentMethods: result.byPaymentMethod || [],
        quarterlyComparison: quarterly,
        monthlyComparison
      },
      breakdown: {
        byBoat: result.byBoat || [],
        byRoute: result.byRoute || [],
        byCity: result.byCity || [],
        byOwner: result.byOwner || []
      }
    };
  }

  private static getEmptyRevenueResponse() {
    return {
      summary: {
        totalRevenue: 0, todayRevenue: 0, yesterdayRevenue: 0,
        thisWeekRevenue: 0, lastWeekRevenue: 0,
        thisMonthRevenue: 0, prevMonthRevenue: 0,
        thisYearRevenue: 0, lifetimeRevenue: 0,
        grossRevenue: 0, netRevenue: 0, refundAmount: 0,
        cancelledAmount: 0, bookingCount: 0, completedTrips: 0,
        averageTicketSize: 0, onlineRevenue: 0, offlineRevenue: 0,
        emergencyRevenue: 0, todayCollection: 0, shiftCollection: 0,
        offlineCollection: 0, cashCollection: 0, upiCollection: 0,
        completedTripsCount: 0, monthGrowth: 0, weekGrowth: 0
      },
      charts: {
        dailyRevenue: [],
        monthlyRevenue: [],
        paymentMethods: [],
        quarterlyComparison: [],
        monthlyComparison: []
      },
      breakdown: {
        byBoat: [],
        byRoute: [],
        byCity: [],
        byOwner: []
      }
    };
  }

  private static getQuarterlySummary(monthlyData: any[]) {
    const quarters: Record<string, number> = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    monthlyData.forEach((item) => {
      const parts = item.rawMonth.split("-");
      const monthNum = parseInt(parts[1]);
      if (monthNum >= 1 && monthNum <= 3) quarters.Q1 += item.revenue;
      else if (monthNum >= 4 && monthNum <= 6) quarters.Q2 += item.revenue;
      else if (monthNum >= 7 && monthNum <= 9) quarters.Q3 += item.revenue;
      else if (monthNum >= 10 && monthNum <= 12) quarters.Q4 += item.revenue;
    });

    return Object.keys(quarters).map((key) => ({
      quarter: key,
      revenue: quarters[key]
    }));
  }

  private static getMonthlyComparison(monthlyData: any[]) {
    if (monthlyData.length < 2) return [];
    const comparison = [];
    for (let i = 1; i < monthlyData.length; i++) {
      const prev = monthlyData[i - 1];
      const curr = monthlyData[i];
      const diff = curr.revenue - prev.revenue;
      const growth = prev.revenue > 0 ? Math.round((diff / prev.revenue) * 100) : 0;
      comparison.push({
        period: `${prev.month} vs ${curr.month}`,
        previousRevenue: prev.revenue,
        currentRevenue: curr.revenue,
        growthPercent: growth
      });
    }
    return comparison;
  }
}
