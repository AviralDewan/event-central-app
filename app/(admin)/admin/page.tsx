import Profile from "@/interfaces/profile";
import Header from "./components/Home/Header";
import RegDataTable from "./components/Home/RegDataTable";
import { mockProfile } from "./events/dummyData";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = mockProfile("Aviral Dewan");
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/sign-in");
  }

  user.pos = "Secretary";
  user.perms = ["download_total_data", "view_table_data"];

  const students: Profile[] = Array.from({ length: 20 }, () => ({
    ...user,
  }));

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] h-[350px] w-[350px] rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full bg-cyan-300/30 blur-3xl" />
      </div>

      {/* Content */}
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8">
        {/* Header Card */}
        <section className="rounded-3xl border border-zinc-200 bg-white/80 shadow-xl backdrop-blur-xl">
          <Header user={user} />
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md">
            <p className="text-sm text-zinc-500">Total Students</p>
            <h2 className="mt-2 text-4xl font-bold">1,248</h2>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md">
            <p className="text-sm text-zinc-500">Registrations Today</p>
            <h2 className="mt-2 text-4xl font-bold text-cyan-600">86</h2>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md">
            <p className="text-sm text-zinc-500">Pending Approval</p>
            <h2 className="mt-2 text-4xl font-bold text-violet-600">17</h2>
          </div>
        </section>

        {/* Table Section */}
        <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Student Registrations
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Manage and review all student registration entries.
              </p>
            </div>

            <button className="rounded-xl bg-zinc-900 px-5 py-2 font-medium text-white transition hover:scale-105 hover:bg-zinc-700">
              Export Data
            </button>
          </div>

          <RegDataTable
            label="Total Student Registration Details Table"
            user={user}
            data={students}
          />
        </section>
      </div>
    </main>
  );
}
