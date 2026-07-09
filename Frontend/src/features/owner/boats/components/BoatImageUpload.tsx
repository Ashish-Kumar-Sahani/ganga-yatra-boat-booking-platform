type Props = {
  preview: string | null;
  onChange: (file: File | null) => void;
};

export default function BoatImageUpload({ preview, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-dashed p-5">
      <label className="mb-3 block text-sm font-semibold text-blue-950">
        Boat Image
      </label>

      {preview ? (
        <img
          src={preview}
          alt="Boat preview"
          className="mb-4 h-48 w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="mb-4 flex h-48 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          No image selected
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="w-full rounded-xl border p-3"
      />
    </div>
  );
}