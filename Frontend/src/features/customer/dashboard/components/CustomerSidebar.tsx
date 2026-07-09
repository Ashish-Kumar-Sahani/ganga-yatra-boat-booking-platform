import {
  Home,
  CalendarCheck,
  Clock,
  Heart,
  User,
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  Gift,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "My Bookings", icon: CalendarCheck },
  { label: "Past Rides", icon: Clock },
  { label: "Wishlist", icon: Heart },
  { label: "Profile", icon: User },
  { label: "Payment Methods", icon: CreditCard },
  { label: "Addresses", icon: MapPin },
  { label: "Settings", icon: Settings },
];

export default function CustomerSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] flex-col border-r border-blue-100 bg-white p-5 shadow-sm lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
          ⛵
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-blue-800">
            GangaYatra
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Boat Ride • Safe • Secure
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
              item.active
                ? "bg-blue-50 text-blue-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <item.icon size={19} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-gradient-to-b from-blue-50 to-purple-50 p-5">
        <Gift className="mb-3 text-blue-700" size={30} />
        <h3 className="font-extrabold text-blue-800">Refer & Earn</h3>
        <p className="mt-2 text-sm text-slate-600">
          Invite your friends and earn exciting rewards!
        </p>
        <button className="mt-4 w-full rounded-xl bg-blue-700 py-3 text-sm font-bold text-white">
          Refer Now
        </button>
      </div>

      <button className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5 text-sm font-bold text-slate-700">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}