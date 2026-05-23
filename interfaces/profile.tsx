type Level = "Foundation" | "Diploma" | "Degree";
type Program =
  | "Data Science"
  | "Electronic Systems"
  | "Management & Data Science"
  | "Aerospace";

type Position =
  | "Secretary"
  | "Deputy Secretary"
  | "Web Admin"
  | "RC"
  | "Dept Head"
  | "Event Head"
  | "Event Team"
  | "Student";

export type Perm =
  | "access_admin"
  | "download_total_data"
  | "view_table_data"
  | "none"
  | any;

export default interface Profile {
  pic?: string;
  name: string;
  email: string;
  level: Level;
  program: Program;
  mobile: number;
  state: string;
  academic_status: "Standalone" | "Dual Degree" | "Working Prof";

  points?: number;
  pos: Position;
  perms?: Perm[];
}
