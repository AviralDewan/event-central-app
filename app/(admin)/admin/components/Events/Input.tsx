export default function Input({
  placeholder,
  changeValue,
  value,
  required,
  label,
  textArea,
  disabled,
}: {
  placeholder: string;
  changeValue: (newVal: string) => void;
  value: string | undefined;
  required: boolean;
  label: string;
  textArea: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="">
      <label className="text-md font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textArea === false ? (
        <input
          placeholder={placeholder}
          onChange={(e) => changeValue(e.target.value)}
          value={value}
          disabled={disabled}
          className={`mt-1 rounded-md border w-full px-3 py-2 outline-none transition ${
            disabled
              ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
              : "border-slate-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
          }`}
        />
      ) : (
        <textarea
          placeholder={placeholder}
          onChange={(e) => changeValue(e.target.value)}
          value={value}
          disabled={disabled}
          className={`resize-none overflow-auto h-[250px] mt-1 rounded-md border w-full px-3 py-2 outline-none transition ${
            disabled
              ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
              : "border-slate-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
          }`}
        />
      )}
    </div>
  );
}
