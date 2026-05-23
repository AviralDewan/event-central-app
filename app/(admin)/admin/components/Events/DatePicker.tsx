export default function DatePicker({
  date,
  setDate,
  label,
  required,
  disabled,
}: {
  date: string;
  setDate: (date: string) => void;
  label?: string;
  required: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="w-full p-2">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {label == undefined && required && (
        <span className="text-red-500">*</span>
      )}
      <br />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={disabled}
        className={`p-3 border rounded-md mt-1 transition ${
          disabled
            ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
            : "border-slate-400 cursor-pointer focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
        }`}
      />
    </div>
  );
}
