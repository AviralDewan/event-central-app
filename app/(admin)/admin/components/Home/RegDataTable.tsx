import Profile from "@/interfaces/profile";
import Link from "next/link";

export default function RegDataTable({
  data,
  user,
  label,
}: {
  user: Profile;
  data: Profile[];
  label?: string;
}) {
  if (!user.perms?.includes("view_table_data")) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8">
        <p className="text-sm text-zinc-600">
          You don’t have permission to view registration data.
        </p>

        <Link
          href="https://youtube.com"
          className="mt-4 inline-flex items-center text-sm font-medium text-zinc-900 hover:text-zinc-600"
        >
          Go to Events Management →
        </Link>
      </div>
    );
  }

  const tableHeaders = [
    "Full Name",
    "Email",
    "Level",
    "Program",
    "Mobile",
    "State",
    "Academic Status",
    "Points",
  ];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white">
      {/* Header */}
      <div className="border-b border-zinc-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            {label && (
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                {label}
              </h2>
            )}

            <p className="mt-1 text-sm text-zinc-500">
              Manage and review registered students.
            </p>
          </div>

          <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((student, idx) => (
              <tr
                key={idx}
                className="border-b border-zinc-100 transition hover:bg-zinc-50"
              >
                {/* Name */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white">
                      {student.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {student.name}
                      </p>

                      <p className="text-xs text-zinc-500">Student</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600">
                  {student.email}
                </td>

                {/* Level */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                    {student.level}
                  </span>
                </td>

                {/* Program */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700">
                  {student.program}
                </td>

                {/* Mobile */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700">
                  {student.mobile}
                </td>

                {/* State */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700">
                  {student.state}
                </td>

                {/* Academic Status */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    {student.academic_status}
                  </span>
                </td>

                {/* Points */}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900">
                  {student.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
