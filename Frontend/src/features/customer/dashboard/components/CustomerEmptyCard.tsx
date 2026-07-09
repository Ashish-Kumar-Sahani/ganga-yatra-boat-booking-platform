import { Ship } from "lucide-react";

type Props = {
  text: string;
};

export default function CustomerEmptyCard({ text }: Props) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 text-center shadow-sm">
      <Ship className="mx-auto mb-2 text-blue-700" size={28} />
      <p className="font-bold text-slate-600">{text}</p>
    </div>
  );
}