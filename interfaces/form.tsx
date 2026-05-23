export type QuestionType =
  | "short"
  | "long"
  | "checkbox"
  | "dropdown"
  | "radio"
  | "email"
  | "number"
  | "date";

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export default interface Form {
  id: string;
  eventId: string;
  title: string;
  desc: string;
  createdBy: any;
  createdOn: string;
  sections: Section[];
}
