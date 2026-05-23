export default function DropDown({
  options,
  selectedOption,
  changeOption,
  disabled,
}: {
  options: any[];
  selectedOption: string;
  changeOption: (option: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      onChange={(e) => changeOption(e.target.value)}
      value={selectedOption}
      disabled={disabled}
      className={`w-full outline-none ${disabled ? "text-slate-455 bg-slate-100 cursor-not-allowed" : ""}`}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id} className="w-full">
          {option.name}
        </option>
      ))}
    </select>
  );
}
