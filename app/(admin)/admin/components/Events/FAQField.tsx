import { FAQ } from "@/interfaces/event";
import Input from "./Input";

export default function FAQField({
  faq,
  idx,
  updateFAQ,
  disabled,
}: {
  faq: FAQ;
  idx: number;
  updateFAQ: (idx: number, field: string, val: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="p-3 flex flex-col w-full gap-3">
      <Input
        placeholder="Enter Question"
        label="Question"
        value={faq.question}
        required={false}
        textArea={false}
        changeValue={(e: string) => updateFAQ(idx, "question", e)}
        disabled={disabled}
      />
      <Input
        label="Answer"
        placeholder="Enter Answer"
        value={faq.answer}
        required={false}
        textArea={false}
        changeValue={(e: string) => updateFAQ(idx, "answer", e)}
        disabled={disabled}
      />
    </div>
  );
}
