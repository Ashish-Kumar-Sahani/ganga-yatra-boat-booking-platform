import AddBoatForm from "@/features/owner/boats/components/AddBoatForm";

export default function AddBoat() {
  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-950">
          Add New Boat
        </h1>

        <p className="text-slate-500">
          Register a new boat into your fleet
        </p>
      </div>

      <AddBoatForm />
    </div>
  );
}