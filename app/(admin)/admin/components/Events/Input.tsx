export default function Input({
  placeholder,
  changeValue,
  value,
  required,
  label,
  textArea,
}: {
  placeholder: string;
  changeValue: (newVal: string) => void;
  value: string | undefined;
  required: boolean;
  label: string;
  textArea: boolean;
}) {
  return (
    <div className="">
      <label className={`text-md`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textArea === false ? (
        <input
          placeholder={placeholder}
          onChange={(e) => changeValue(e.target.value)}
          value={value}
          className="mt-1 rounded-md border border-slate-400 w-full px-3 py-2 outline-none"
        />
      ) : (
        <textarea
          placeholder={placeholder}
          onChange={(e) => changeValue(e.target.value)}
          value={value}
          className="resize-none overflow-auto h-[250px] mt-1 rounded-md border border-slate-400 w-full px-3 py-2 outline-none"
        />
      )}
    </div>
  );
}
