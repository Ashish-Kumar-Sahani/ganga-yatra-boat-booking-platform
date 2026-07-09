import {
  Bell,
  CalendarDays,
  Heart,
  Headphones,
  Home,
  Menu,
  Search,
  User,
} from "lucide-react";

export default function CustomerTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-blue-100 bg-white/90 px-5 backdrop-blur">
      <div className="flex items-center gap-4">
        <button className="rounded-xl p-2 text-blue-900 hover:bg-blue-50 lg:hidden">
          <Menu />
        </button>

        <div className="hidden w-[420px] items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 md:flex">
          <input
            placeholder="Search boats, ghats, experiences..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <Search size={20} className="text-blue-800" />
        </div>
      </div>

      <nav className="hidden items-center gap-8 xl:flex">
        <button className="flex items-center gap-2 border-b-2 border-blue-700 pb-5 text-sm font-bold text-blue-700">
          <Home size={18} /> Home
        </button>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <CalendarDays size={18} /> My Bookings
        </button>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <User size={18} /> My Profile
        </button>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Heart size={18} /> Wishlist
        </button>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Headphones size={18} /> Support
        </button>
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={22} />
          <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
            3
          </span>
        </div>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=12"
            className="h-10 w-10 rounded-full object-cover"
            alt="profile"
          />
          <p className="hidden text-sm font-extrabold md:block">Amit Sharma</p>
        </div>
      </div>
    </header>
  );
}