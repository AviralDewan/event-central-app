import Profile from "@/interfaces/profile";
import Header from "./components/Home/Header";
import RegDataTable from "./components/Home/RegDataTable";
import { mockProfile } from "./events/dummyData";

export default function Home() {
  const user = mockProfile("Aviral Dewan");
  user.pos = "Secretary";
  user.perms = ["download_total_data", "view_table_data"];

  const students: Profile[] = new Array(20).fill(user);

  return (
    <div className="">
      <Header user={user} />
      <RegDataTable
        label="Total Student Registration Details Table"
        user={user}
        data={students}
      />
    </div>
  );
}
