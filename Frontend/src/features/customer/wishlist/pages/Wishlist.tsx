import { useEffect } from "react";
import { Heart, Ship, Users, CalendarCheck } from "lucide-react";
import { useCustomerStore } from "../../store/customerStore";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, fetchWishlist, toggleWishlist, loadingWishlist } = useCustomerStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleWishlist(id);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-blue-950 dark:text-white">My Wishlist</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Keep track of your favorite boats and cruises for quick booking
          </p>
        </div>
      </header>

      {loadingWishlist && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 font-bold">Loading favorites...</p>
        </div>
      )}

      {!loadingWishlist && wishlist.length === 0 && (
        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-12 text-center shadow-sm max-w-lg mx-auto">
          <Heart size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Your wishlist is empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Explore and add boats to your wishlist to book them later.
          </p>
          <button
            onClick={() => navigate("/search-route")}
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow hover:bg-blue-700 transition-colors"
          >
            Find Trips
          </button>
        </div>
      )}

      {!loadingWishlist && wishlist.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((boat) => (
            <div
              key={boat._id}
              onClick={() => navigate("/search-route")}
              className="group overflow-hidden rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
            >
              {/* Image Banner */}
              <div className="relative h-48 w-full bg-blue-50 overflow-hidden">
                {boat.image ? (
                  <img
                    src={boat.image}
                    alt={boat.boatName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600">
                    <Ship size={48} />
                  </div>
                )}

                {/* Heart Toggle */}
                <button
                  onClick={(e) => handleRemove(e, boat._id)}
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-red-500 shadow hover:bg-white transition-colors"
                  title="Remove from favorites"
                >
                  <Heart size={18} className="fill-red-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate">
                      {boat.boatName}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 mt-0.5 uppercase tracking-wide">
                      {boat.boatNumber}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                      boat.isAvailable
                        ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}
                  >
                    {boat.isAvailable ? "Available" : "Maintenance"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-50 dark:border-slate-700/50 pt-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                    <Ship size={14} className="text-slate-400" />
                    <span>{boat.boatType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <span>{boat.capacity} Seats</span>
                  </div>
                </div>

                {/* Book Action */}
                <button
                  onClick={() => navigate("/search-route")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white group-hover:bg-blue-700 transition-colors"
                >
                  <CalendarCheck size={16} />
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
