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
  if (!user.perms?.find((perm) => perm === "view_table_data")) {
    return (
      <div className="p-3 md:p-5">
        <p className="">
          You don't have permission to view full registration data.
        </p>
        <Link href="https://youtube.com">
          <p className="mt-2">Click here to go to events mangagement</p>
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
    <div className="p-3 md:p-5">
      {label && <p className="text-lg font-medium">{label}</p>}
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  className="font-semibold px-4 py-2 text- text-gray-600 text-center"
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
                className="text-center even:bg-gray-50 odd:bg-white border-t hover:bg-gray-100 transition"
              >
                <td className="px-3 py-4">{student.name}</td>
                <td className="px-3 py-4">{student.email}</td>
                <td className="px-3 py-4">{student.level}</td>
                <td className="px-3 py-4">{student.program}</td>
                <td className="px-3 py-4">{student.mobile}</td>
                <td className="px-3 py-4">{student.state}</td>
                <td className="px-3 py-4">{student.academic_status}</td>
                <td className="px-3 py-4">{student.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
