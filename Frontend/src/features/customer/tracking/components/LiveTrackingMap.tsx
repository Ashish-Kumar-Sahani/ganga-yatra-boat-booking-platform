type LiveTrackingMapProps = {
  trip?: {
    currentLat?: number;
    currentLng?: number;
    startLat?: number;
    startLng?: number;
    endLat?: number;
    endLng?: number;
    routeName?: string;
    boatName?: string;
    status?: string;
  } | null;
};

export default function LiveTrackingMap({ trip }: LiveTrackingMapProps) {
  const currentLat = trip?.currentLat || 25.3176;
  const currentLng = trip?.currentLng || 82.9739;

  const mapUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&z=15&output=embed`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-b-3xl bg-blue-50">
      <iframe
        title="Live Boat Tracking Map"
        src={mapUrl}
        className="h-full w-full border-0"
        loading="lazy"
        allowFullScreen
      />

      <div className="absolute left-4 top-4 rounded-2xl bg-white/95 p-4 shadow-lg">
        <p className="text-xs font-bold uppercase text-slate-400">
          Current Boat Location
        </p>

        <h4 className="mt-1 font-extrabold text-slate-900">
          {trip?.boatName || "Boat Ride"}
        </h4>

        <p className="mt-1 text-sm font-semibold text-blue-700">
          {trip?.routeName || "GangaYatra Route"}
        </p>

        <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          {trip?.status || "LIVE"}
        </span>
      </div>
    </div>
  );
}