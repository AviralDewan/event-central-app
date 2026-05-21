import Profile from "./profile";

export type questionTypes =
  | "short"
  | "paragraph"
  | "single-select"
  | "multi-select"
  | "number";

export interface BaseQuestion {
  id: string;
  formId: string;
  questionText: string;
  type: questionTypes;
  required: boolean;
  order: number;
}

export interface Response {
  id: string;
  formId: string;
  submittedAt: string;
}

export interface BaseAnswer {
  id: string;
  formId: string;
  questionId: string;
  responseId: string;
}

export interface TextAnswer extends BaseAnswer {
  input: string;
}

export interface NumericAnswer extends BaseAnswer {
  input: number;
}

export interface SingleSelectAnswer extends BaseAnswer {
  optionId: string;
}

export interface MultiSelectAnswer extends BaseAnswer {
  optionIds: string[];
}

export interface TextQuestion extends BaseQuestion {
  type: "short" | "paragraph";
}

export interface NumericQuestion extends BaseQuestion {
  type: "number";
}

export interface Option {
  id: string;
  questionId: string;
  text: string;
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: "multi-select";
  options: Option[];
}

export interface SingleSelectQuestion extends BaseQuestion {
  type: "single-select";
  options: Option[];
}

export type Question =
  | TextQuestion
  | NumericQuestion
  | MultiSelectQuestion
  | SingleSelectQuestion;

export type Answer =
  | TextAnswer
  | NumericAnswer
  | MultiSelectAnswer
  | SingleSelectAnswer;

export default interface Form {
  id: string;
  eventId: string;
  title: string;
  desc?: string;
  createdBy: Profile;
  createdOn: string;
}
