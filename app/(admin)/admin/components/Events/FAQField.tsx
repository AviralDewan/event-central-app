import { FAQ } from "@/interfaces/event";
import Input from "./Input";

export default function FAQField({
  faq,
  idx,
  updateFAQ,
}: {
  faq: FAQ;
  idx: number;
  updateFAQ: (idx: number, field: string, val: string) => void;
}) {
  return (
    <div className="p-3 flex flex-col w-full">
      <Input
        placeholder="Enter Question"
        label="Question"
        value={faq.question}
        required={false}
        textArea={false}
        changeValue={(e: string) => updateFAQ(idx, "question", e)}
      />
      <Input
        label="Answer"
        placeholder="Enter Answer"
        value={faq.answer}
        required={false}
        textArea={false}
        changeValue={(e: string) => updateFAQ(idx, "answer", e)}
      />
    </div>
  );
}
