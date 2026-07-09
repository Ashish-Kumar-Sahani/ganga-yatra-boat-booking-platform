interface Props {
  today: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export default function RevenueStats({
  today,
  weekly,
  monthly,
  yearly,
}: Props) {
  return (
    <div className="grid md:grid-cols-4 gap-5">
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3>Today</h3>
        <p className="text-3xl font-bold">₹{today}</p>
      </div>

      <div className="bg-green-50 p-5 rounded-2xl">
        <h3>Weekly</h3>
        <p className="text-3xl font-bold">₹{weekly}</p>
      </div>

      <div className="bg-blue-50 p-5 rounded-2xl">
        <h3>Monthly</h3>
        <p className="text-3xl font-bold">₹{monthly}</p>
      </div>

      <div className="bg-purple-50 p-5 rounded-2xl">
        <h3>Yearly</h3>
        <p className="text-3xl font-bold">₹{yearly}</p>
      </div>
    </div>
  );
}