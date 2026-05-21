export default function DatePicker({
  date,
  setDate,
  label,
  required,
}: {
  date: string;
  setDate: (date: string) => void;
  label?: string;
  required: boolean;
}) {
  return (
    <div className="w-full p-2">
      {label && (
        <label className="">
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
        className="p-3 border rounded-md cursor-pointer"
      />
    </div>
  );
}
