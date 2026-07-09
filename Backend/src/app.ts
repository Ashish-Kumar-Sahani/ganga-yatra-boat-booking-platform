import express from "express";
import cors from "cors";
import path from "path";
// import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";

import cityRoutes from "./modules/cities/city.routes.js";
import ghatRoutes from "./modules/ghats/ghat.routes.js";

import boatRoutes from "./modules/boats/boat.routes.js";
import routeRoutes from "./modules/routes/route.routes.js";

import scheduleRoutes from "./modules/schedules/schedule.routes.js";
import slotsRoutes from "./modules/slots/slot.routes.js";

import bookingRoutes from "./modules/bookings/booking.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";

import dashboardRoutes from "./modules/reports/dashboard.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";

import offerRoutes from "./modules/offers/offer.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";

import permitRoutes from "./modules/permits/permit.routes.js";
import tripRoutes from "./modules/trips/trip.routes.js";
import weatherRoutes from "./modules/weather/weather.routes.js";

import reviewRoutes from "./modules/reviews/review.routes.js";
import staffRoutes from "./modules/staff/staff.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import customerRoutes from "./modules/customer/customer.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";

import ticketRoutes from "./modules/tickets/ticket.routes.js";
import settingRoutes from "./modules/settings/setting.routes.js";
import searchRoutes from "./modules/search/search.routes.js";


import authorityRoutes from "./modules/authority/authority.routes.js";
import adminAuthorityRoutes from "./modules/authority/admin-authority.routes.js";

const app = express();

/* =========================
   Middlewares
========================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

// app.use(morgan("dev"));

/* =========================
   Health Check
========================= */

app.get("/", (_req, res) => {
  res.send("Water Boat Booking API Running 🚤");
});

/* =========================
   Auth
========================= */

app.use("/api/auth", authRoutes);

/* =========================
   Masters
========================= */

app.use("/api/cities", cityRoutes);
app.use("/api/ghats", ghatRoutes);

app.use("/api/routes", routeRoutes);
app.use("/api/boats", boatRoutes);

/* =========================
   Operations
========================= */

app.use("/api/schedules", scheduleRoutes);
app.use("/api/slots", slotsRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/attendance", attendanceRoutes);

/* =========================
   Customer Module
========================= */

app.use("/api/customer", customerRoutes);

/* =========================
   Reviews
========================= */

app.use("/api/reviews", reviewRoutes);

/* =========================
   Notifications
========================= */

app.use("/api/notifications", notificationRoutes);

/* =========================
   Offers
========================= */

app.use("/api/offers", offerRoutes);

/* =========================
   Permits
========================= */

app.use("/api/permits", permitRoutes);

/* =========================
   Trips
========================= */

app.use("/api/trips", tripRoutes);

/* =========================
   Weather
========================= */

app.use("/api/weather", weatherRoutes);

/* =========================
   Reports
========================= */

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/authority", authorityRoutes);
app.use("/api/admin/authorities", adminAuthorityRoutes);

/* =========================
   Users
========================= */

app.use("/api/users", userRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/search", searchRoutes);


/* =========================
   404 Handler
========================= */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

export default app;