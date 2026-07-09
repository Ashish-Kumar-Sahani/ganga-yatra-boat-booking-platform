import type { OwnerDashboardData } from "../types/owner.types";

type Props = {
  dashboard: OwnerDashboardData | null;
};

export default function OwnerReviews({ dashboard }: Props) {
  const reviews = dashboard?.reviews || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-blue-950">Top Reviews</h2>
        <button className="text-sm font-semibold text-blue-600">View All</button>
      </div>

      <div className="mt-5 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500">No reviews found.</p>
        ) : (
          reviews.map((review: any) => (
            <div key={review._id} className="border-b pb-4 last:border-none">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-blue-950">
                  {review.customerName || "Customer"}
                </h4>

                <span className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              <p className="mt-1 text-yellow-500">
                {"★".repeat(review.rating || 0)}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}