"use client";

import { Perm } from "@/interfaces/profile";

export default function DownloadDataBtn({
  studentPerms,
}: {
  studentPerms: Perm[];
}) {
  const downloadData = () => {
    alert("download data");
  };

  if (!studentPerms.find((perm) => perm === "download_total_data")) return null;

  return (
    <button
      onClick={downloadData}
      className="cursor-pointer px-5 py-3 rounded-md bg-gray-200 flex items-center gap-x-1"
    >
      <span className="material-symbols-outlined">download</span> Download Data
      as CSV
    </button>
  );
}
