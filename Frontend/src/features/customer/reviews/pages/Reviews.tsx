import { useEffect, useState } from "react";
import { MessageSquare, Star, Send, AlertCircle, Ship } from "lucide-react";
import {
  createCustomerReview,
  getCustomerReviews,
  getMyBookings,
} from "@/features/customer/dashboard/api/customerApi";
import { useSearchParams } from "react-router-dom";

type Review = {
  _id: string;
  bookingId: string;
  boatId: {
    boatName: string;
    boatNumber: string;
  };
  rating: number;
  boatRating: number;
  captainRating: number;
  tripRating: number;
  ownerRating: number;
  comment: string;
  createdAt?: string;
};

export default function Reviews() {
  const [searchParams] = useSearchParams();
  const bookingQueryId = searchParams.get("booking") || "";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    bookingId: bookingQueryId,
    boatRating: 5,
    captainRating: 5,
    tripRating: 5,
    ownerRating: 5,
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getCustomerReviews();
      setReviews(data || []);
    } catch (error) {
      console.error("Reviews fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsList = async () => {
    try {
      const data = await getMyBookings();
      // Only permit reviews for completed or paid rides that don't have reviews yet
      const list = Array.isArray(data) ? data : data?.data || [];
      setBookings(list.filter((b: any) => b.bookingStatus === "COMPLETED" || b.bookingStatus === "CONFIRMED"));
    } catch (err) {
      console.error("Failed to load bookings list:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchBookingsList();
  }, []);

  useEffect(() => {
    if (bookingQueryId) {
      setForm((prev) => ({ ...prev, bookingId: bookingQueryId }));
    }
  }, [bookingQueryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookingId) {
      alert("Please select a ride booking reference");
      return;
    }
    if (!form.comment.trim()) {
      alert("Please write a small comment about your ride");
      return;
    }

    try {
      setLoading(true);
      // Calculate overall average rating
      const rating = Math.round((form.boatRating + form.captainRating + form.tripRating + form.ownerRating) / 4);

      await createCustomerReview({
        ...form,
        rating,
      } as any);

      setForm({
        bookingId: "",
        boatRating: 5,
        captainRating: 5,
        tripRating: 5,
        ownerRating: 5,
        comment: "",
      });
      alert("Review submitted successfully! Thank you for your feedback.");
      await fetchReviews();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Review submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white">Customer Reviews</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Rate boats, captains, owner services, and share comments about your river cruise
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Review Form */}
        <div className="lg:col-span-2 rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-5 h-fit">
          <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            Write Ride Review
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Select Booking Reference
              </label>
              <select
                value={form.bookingId}
                onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3.5 text-sm font-semibold outline-none focus:border-blue-500"
              >
                <option value="">-- Select Completed Ride --</option>
                {bookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.slotId?.scheduleId?.boatId?.boatName || "Boat Ride"} ({b.bookingCode || b._id.slice(0, 8)})
                  </option>
                ))}
              </select>
            </div>

            {/* Matrix Rating Grid */}
            <div className="grid gap-4 sm:grid-cols-2 bg-slate-50/50 dark:bg-slate-900/20 p-4 rounded-2xl border border-slate-100/10">
              <RatingSelector
                label="Boat Quality & Safety"
                value={form.boatRating}
                onChange={(val) => setForm({ ...form, boatRating: val })}
              />
              <RatingSelector
                label="Captain Professionalism"
                value={form.captainRating}
                onChange={(val) => setForm({ ...form, captainRating: val })}
              />
              <RatingSelector
                label="Trip Route & Punctuality"
                value={form.tripRating}
                onChange={(val) => setForm({ ...form, tripRating: val })}
              />
              <RatingSelector
                label="Owner Customer Service"
                value={form.ownerRating}
                onChange={(val) => setForm({ ...form, ownerRating: val })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Write Comments
              </label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={4}
                placeholder="Share detail about safety vests, cleanliness, river speed, captain communication, or refund handling..."
                className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
              />
            </div>

            {/* Images Upload Placeholder */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Upload Photo Proof (Simulated)
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center text-slate-400 cursor-not-allowed">
                <p className="text-xs font-bold">Image Attachments Disabled (Placeholder)</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Image upload helper in sandbox mode</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 font-bold text-white shadow transition-all disabled:opacity-60"
            >
              <Send size={16} />
              Submit detailed feedback
            </button>
          </form>
        </div>

        {/* Review History Sidebar list */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 dark:text-white">Review History ({reviews.length})</h3>

          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-600 border-t-transparent" />
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-8 text-center text-slate-400">
              <AlertCircle size={32} className="mx-auto mb-2" />
              <p className="text-xs font-bold">No reviews logged yet</p>
            </div>
          )}

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-3xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-blue-50 dark:bg-slate-900/50 flex items-center justify-center text-blue-600">
                    <Ship size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {review.boatId?.boatName || "Boat Ride"}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400">
                      ID: {review.bookingId?.slice(-8) || "Completed"}
                    </p>
                  </div>
                </div>

                {/* Sub-ratings display */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">Boat:</span>
                    <span className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-0.5"><Star size={10} className="text-yellow-500 fill-yellow-500" />{review.boatRating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">Captain:</span>
                    <span className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-0.5"><Star size={10} className="text-yellow-500 fill-yellow-500" />{review.captainRating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">Trip:</span>
                    <span className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-0.5"><Star size={10} className="text-yellow-500 fill-yellow-500" />{review.tripRating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">Owner:</span>
                    <span className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-0.5"><Star size={10} className="text-yellow-500 fill-yellow-500" />{review.ownerRating}</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed italic border-t border-slate-50 dark:border-slate-700/50 pt-2">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-1">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="hover:scale-110 transition-transform"
          >
            <Star
              size={18}
              className={star <= value ? "text-yellow-500 fill-yellow-500" : ""}
            />
          </button>
        ))}
      </div>
    </div>
  );
}