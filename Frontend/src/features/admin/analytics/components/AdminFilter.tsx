type Props = {
  searchPlaceholder?: string;
};

export default function AdminFilters({
  searchPlaceholder,
}: Props) {
  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow">
      <div className="flex flex-col gap-4 lg:flex-row">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="flex-1 rounded-xl border p-3"
        />

        <button className="rounded-xl border px-5 py-3">
          Filter
        </button>
      </div>
    </div>
  );
}