import Profile from "./profile";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Round {
  id: string;
  roundNumber: number;
  desc: string;
  startDate: string;
  endDate: string;
}

export interface Prize {
  id: string;
  position: 1 | 2 | 3 | "Participant";
  prize: string;
}

export default interface Event {
  id: string;
  name: string;
  finalLevelApproved: "pending" | [false, Profile] | [true, Profile];
  firstLevelApproved: "pending" | [false, Profile] | [true, Profile];
  createdBy: Profile;
  eventTeam: Profile[];
  createdOn: string;
  tagline?: string;
  poster: string;
  desc: string;
  genre: "Technicals" | "Culturals" | "Sports";
  prizes: Prize[];
  rules: string[];
  rounds: Round[];
  FAQs: FAQ[];
  submissionURL: string;
  eventHeadEmail?: string;
  isSubmittedByHead?: boolean;
}
