type Props = {
  title: string;
  description: string;
  buttonText?: string;
};

export default function AdminPageHeader({
  title,
  description,
  buttonText,
}: Props) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-3xl font-bold text-blue-950">
          {title}
        </h1>

        <p className="text-slate-500">
          {description}
        </p>
      </div>

      {buttonText && (
        <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">
          {buttonText}
        </button>
      )}
    </div>
  );
}