import Profile from "@/interfaces/profile";
import Header from "./components/Home/Header";
import RegDataTable from "./components/Home/RegDataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { mockProfile } from "./events/dummyData"; // Will replace with real data later

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/sign-in");
  }

  const backendUser = (session as any).backendUser;
  
  // Logic to determine if user is Dept Head based on global/department role
  const isDeptHead = 
    backendUser?.role === "admin" || 
    backendUser?.role === "core" || 
    backendUser?.role === "super_core" ||
    backendUser?.departments?.some((d: any) => d.role === "coordinator");

  // If not Dept Head, assume they are Event Head (or restricted) and redirect to events page
  if (!isDeptHead) {
    redirect("/admin/events");
  }

  const user = mockProfile(session.user?.name || "Admin User");
  user.pos = backendUser?.role || "Secretary";
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
