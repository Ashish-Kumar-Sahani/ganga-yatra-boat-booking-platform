import { useNavigate } from "react-router-dom";

export default function CustomerHero() {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-100 to-orange-100 shadow-sm">
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="mb-2 text-lg font-semibold text-slate-700">
            Experience the Divine
          </p>

          <h1 className="text-4xl font-extrabold text-slate-900">
            Boat Rides in <span className="text-blue-700">Varanasi</span>
          </h1>

          <p className="mt-4 max-w-lg text-slate-600">
            Book safe, verified and government approved boat rides across
            popular ghats.
          </p>

          <button
            onClick={() => navigate("/search")}
            className="mt-6 w-fit rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200"
          >
            Search Boats
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=900"
          alt="Varanasi Boat Ride"
          className="h-64 w-full rounded-3xl object-cover"
        />
      </div>
    </section>
  );
}