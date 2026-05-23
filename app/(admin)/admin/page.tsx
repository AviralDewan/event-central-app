import Profile from "@/interfaces/profile";
import Header from "./components/Home/Header";
import RegDataTable from "./components/Home/RegDataTable";
<<<<<<< Updated upstream
import { mockProfile } from "./events/dummyData";

export default function Home() {
  const user = mockProfile("Aviral Dewan");
=======
import { events, mockProfile } from "./events/dummyData";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/sign-in");
  }

  const userEmail = session.user?.email || "";
  const isEventHead =
    events.some((e) => e.eventHeadEmail === userEmail) ||
    /^[0-9]+[a-z]+/i.test(userEmail) ||
    userEmail.startsWith("24f");

  if (isEventHead) {
    redirect("/admin/events");
  }

  const user = mockProfile("Aviral Dewan");

>>>>>>> Stashed changes
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
