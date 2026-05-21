import { Round } from "@/interfaces/event";
import Input from "./Input";
import DatePicker from "./DatePicker";

export default function RoundField({
  round,
  updateRound,
  idx,
}: {
  round: Round;
  idx: number;
  updateRound: (
    idx: number,
    type: "startDate" | "endDate" | "desc",
    val: string,
    date: string
  ) => void;
}) {
  return (
    <div className="w-full p-1">
      <p className="text-lg font-medium">Round #{round.roundNumber}</p>
      <Input
        placeholder="Enter Round Description"
        changeValue={(val) => updateRound(idx, "desc", val, "date")}
        value={round.desc}
        required={true}
        label={`Description for Round #${round.roundNumber}`}
        textArea={true}
      />
      <DatePicker
        date={round.startDate}
        required={true}
        label="Round Start Date"
        setDate={(date) => updateRound(idx, "startDate", "startDate", date)}
      />
      <DatePicker
        date={round.endDate}
        required={true}
        label="Round End Date"
        setDate={(date) => updateRound(idx, "endDate", "endDate", date)}
      />
    </div>
  );
}
