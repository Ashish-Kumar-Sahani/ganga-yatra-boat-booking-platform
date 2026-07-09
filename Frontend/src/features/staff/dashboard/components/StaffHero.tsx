export default function StaffHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl">
      <img
        src="/images/VaranasiBanner.png"
        alt="Varanasi"
        className="h-[320px] w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-2xl px-8">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur">
            Operations Control Center
          </span>

          <h1 className="mt-4 text-4xl font-black text-white">
            Welcome Back Manager
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Manage bookings, boats, staff activities and daily river
            transportation operations from one place.
          </p>

          <div className="mt-6 flex gap-3">
            <button className="rounded-xl bg-white px-5 py-3 font-bold text-blue-900">
              View Bookings
            </button>

            <button className="rounded-xl border border-white px-5 py-3 font-bold text-white">
              Manage Boats
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}