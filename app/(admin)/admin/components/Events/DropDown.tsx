export default function DropDown({
  options = [],
  selectedOption,
  changeOption,
}: {
  options?: any[];
  selectedOption: string;
  changeOption: (option: string) => void;
}) {
  return (
    <select
      onChange={(e) => changeOption(e.target.value)}
      value={selectedOption}
      className="w-full outline-none"
    >
      {options.map((option) => (
        <option key={option.id} value={option.id} className="w-full">
          {option.name}
        </option>
      ))}
    </select>
  );
}
