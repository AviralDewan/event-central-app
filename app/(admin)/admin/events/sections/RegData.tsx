"use client";

import { useState } from "react";
import Event from "@/interfaces/event";

interface RegistrationRow {
  regId: string;
  name: string;
  email: string;
  attended: string;
  hasParticipated: string;
  isWinner: string;
  formName: string;
  formEmail: string;
  mobile: string;
}

export default function RegData({
  event,
}: {
  event: Event;
  setEvent: (event: Event) => void;
}) {
  const [filterQuery, setFilterQuery] = useState("");
  const [filterColumnKey, setFilterColumnKey] = useState<keyof RegistrationRow | "all">("all");
  const [filterColumnLabel, setFilterColumnLabel] = useState("Select a filter");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof RegistrationRow | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Mock registration data exactly matching the screenshot
  const [rows] = useState<RegistrationRow[]>([
    {
      regId: "1017",
      name: "25F3000841 NISSAN SHAW",
      email: "25f3000841@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "25F3000841 NISSAN SHAW",
      formEmail: "25f3000841@ds.study.iitm.ac.in",
      mobile: "+918270401989",
    },
    {
      regId: "277",
      name: "Aayush Chourasia (DS)",
      email: "23f3001874@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "Aayush Chourasia",
      formEmail: "23f3001874@ds.study.iitm.ac.in",
      mobile: "+918103887553",
    },
    {
      regId: "337",
      name: "PRIYANSHI (DS) DS",
      email: "24f3004501@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "PRIYANSHI",
      formEmail: "24f3004501@ds.study.iitm.ac.in",
      mobile: "7358002643",
    },
    {
      regId: "1036",
      name: "Krish Avasthi (DS) DS",
      email: "25f3001993@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "Krish Avasthi",
      formEmail: "25f3001993@ds.study.iitm.ac.in",
      mobile: "+919887770313",
    },
    {
      regId: "502",
      name: "Apurva Bharti (DS) DS",
      email: "24f3004938@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "Apurva Bharti",
      formEmail: "24f3004938@ds.study.iitm.ac.in",
      mobile: "+918521023285",
    },
    {
      regId: "478",
      name: "25F2006114 KARTIKEY PANDEY",
      email: "25f2006114@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "25F2006114 KARTIKEY PANDEY",
      formEmail: "25f2006114@ds.study.iitm.ac.in",
      mobile: "+918081055719",
    },
    {
      regId: "550",
      name: "VEDHA SRI (DS) DS",
      email: "25f1000075@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "VEDHA SRI",
      formEmail: "25f1000075@ds.study.iitm.ac.in",
      mobile: "8309477057",
    },
    {
      regId: "582",
      name: "Sarika Pandian (DS) DS",
      email: "23f2000063@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "Sarika Pandian",
      formEmail: "23f2000063@ds.study.iitm.ac.in",
      mobile: "+919768606318",
    },
    {
      regId: "624",
      name: "25F3005976 TUHIN NATH",
      email: "25f3005976@ds.study.iitm.ac.in",
      attended: "No",
      hasParticipated: "",
      isWinner: "",
      formName: "TUHIN NATH",
      formEmail: "25f3005976@ds.study.iitm.ac.in",
      mobile: "6009845747",
    },
  ]);

  const filterColumns: { key: keyof RegistrationRow | "all"; label: string }[] = [
    { key: "all", label: "All Columns" },
    { key: "regId", label: "Reg_id" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "attended", label: "Attended" },
    { key: "formName", label: "Form Name" },
    { key: "mobile", label: "Mobile" },
  ];

  const handleSort = (colKey: keyof RegistrationRow) => {
    if (sortColumn === colKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(colKey);
      setSortAsc(true);
    }
  };

  // CSV Downloader function
  const downloadCSV = () => {
    const headers = [
      "RegId",
      "Name",
      "Email",
      "Attended",
      "HasParticipated",
      "IsWinner",
      "FormName",
      "FormEmail",
      "Mobile",
    ];
    
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.regId,
          `"${row.name}"`,
          row.email,
          row.attended,
          row.hasParticipated,
          row.isWinner,
          `"${row.formName}"`,
          row.formEmail,
          row.mobile,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.name.replace(/\s+/g, "_")}_registration_data.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and Sort Rows
  const processedRows = [...rows]
    .filter((row) => {
      if (!filterQuery) return true;
      const query = filterQuery.toLowerCase();
      if (filterColumnKey === "all") {
        return Object.values(row).some((val) => val.toLowerCase().includes(query));
      } else {
        return row[filterColumnKey].toLowerCase().includes(query);
      }
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const valA = a[sortColumn].toLowerCase();
      const valB = b[sortColumn].toLowerCase();
      
      // Handle numeric sorts
      if (sortColumn === "regId") {
        return sortAsc ? parseInt(a.regId) - parseInt(b.regId) : parseInt(b.regId) - parseInt(a.regId);
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const headersList: { key: keyof RegistrationRow; label: string }[] = [
    { key: "regId", label: "Reg_id" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "attended", label: "Attended" },
    { key: "hasParticipated", label: "Has_participated" },
    { key: "isWinner", label: "Is_winner" },
    { key: "formName", label: "Name" },
    { key: "formEmail", label: "Student Email ID" },
    { key: "mobile", label: "Mobile" },
  ];

  return (
    <div className="w-full py-4 select-none relative">
      
      {/* Click backdrop to dismiss filter dropdown */}
      {isFilterDropdownOpen && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setIsFilterDropdownOpen(false)}
        />
      )}

      {/* Row 1: Shift + Scroll & Download Button */}
      <div className="flex items-center justify-between mt-2 mb-4">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <span className="material-symbols-outlined text-[16px] text-zinc-500">info</span>
          <span>Shift + Scroll to scroll sideways</span>
        </div>

        <button
          onClick={downloadCSV}
          className="bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs py-2 px-4 rounded-md transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
        >
          Download Data
        </button>
      </div>

      {/* Row 2: Search filters */}
      <div className="flex justify-end items-center gap-3 mb-4 z-40 relative">
        
        {/* Custom Filter Selector */}
        <div className="relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="bg-[#0a0a0a] border border-zinc-850 rounded-md px-3.5 py-2 text-xs text-zinc-300 flex items-center gap-2 cursor-pointer w-[150px] justify-between hover:border-zinc-700 transition-colors font-medium"
          >
            <span>{filterColumnLabel}</span>
            <span className="material-symbols-outlined text-[16px] text-zinc-500">
              {isFilterDropdownOpen ? "arrow_drop_up" : "arrow_drop_down"}
            </span>
          </button>

          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-[150px] bg-black border border-zinc-900 rounded-md shadow-2xl py-1 z-50 overflow-hidden">
              {filterColumns.map((col) => (
                <button
                  key={col.key}
                  onClick={() => {
                    setFilterColumnKey(col.key);
                    setFilterColumnLabel(col.label);
                    setIsFilterDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2.5 text-xs text-left cursor-pointer transition-colors bg-black text-zinc-300 hover:text-white hover:bg-zinc-900/60"
                >
                  {col.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input box */}
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter"
          className="bg-[#0a0a0a] border border-zinc-850 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-650 outline-none w-[180px] focus:border-zinc-600 transition-colors font-medium"
        />
      </div>

      {/* Row 3: Horizontal scrollable table container */}
      <div className="overflow-x-auto w-full border border-zinc-900 rounded-lg bg-[#030303] shadow-2xl max-w-full">
        <table className="min-w-[1250px] w-full border-collapse text-left text-xs text-zinc-300">
          <thead>
            <tr className="bg-[#080808]">
              {headersList.map((header) => (
                <th
                  key={header.key}
                  onClick={() => handleSort(header.key)}
                  className={`px-4 py-3 border-b border-zinc-900 select-none cursor-pointer hover:text-white transition-colors whitespace-nowrap font-medium ${
                    sortColumn === header.key ? "text-white" : "text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{header.label}</span>
                    <span className="text-[12px] text-zinc-500 font-normal">
                      {sortColumn === header.key ? (sortAsc ? "↑" : "↓") : "⇅"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedRows.length === 0 ? (
              <tr>
                <td colSpan={headersList.length} className="text-center py-10 text-zinc-500 font-medium italic">
                  No matching registration records found.
                </td>
              </tr>
            ) : (
              processedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-zinc-950/60 border-b border-zinc-900 last:border-b-0 transition-colors"
                >
                  <td className="px-4 py-3.5 whitespace-nowrap font-medium text-zinc-200">{row.regId}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap max-w-[180px] truncate text-zinc-300" title={row.name}>
                    {row.name}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap max-w-[180px] truncate text-zinc-400" title={row.email}>
                    {row.email}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-400">{row.attended}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-400">{row.hasParticipated || "—"}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-400">{row.isWinner || "—"}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap max-w-[150px] truncate text-zinc-300" title={row.formName}>
                    {row.formName}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap max-w-[180px] truncate text-zinc-400" title={row.formEmail}>
                    {row.formEmail}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-350">{row.mobile}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
