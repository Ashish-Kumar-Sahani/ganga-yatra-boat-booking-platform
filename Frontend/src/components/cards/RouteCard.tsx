import { ArrowRight } from "lucide-react";

type Props = {
  from: string;
  to: string;
  distance: string;
  duration: string;
};

export default function RouteCard({
  from,
  to,
  distance,
  duration,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            From
          </p>

          <h3 className="font-black text-slate-900">
            {from}
          </h3>
        </div>

        <ArrowRight
          size={22}
          className="text-blue-600"
        />

        <div className="text-right">
          <p className="text-sm text-slate-500">
            To
          </p>

          <h3 className="font-black text-slate-900">
            {to}
          </h3>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-sm font-semibold text-slate-500">
          {distance}
        </span>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {duration}
        </span>
      </div>
    </div>
  );
}