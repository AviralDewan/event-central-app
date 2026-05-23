"use client";

import { useEffect, useState } from "react";
import DropDown from "../components/Events/DropDown";
import { events } from "./dummyData";
import RegData from "./sections/RegData";
import EventDetails from "./sections/EventDetails";
import RegForm from "./sections/RegForm";
import Event from "@/interfaces/event";

type tabType = "Event Details" | "Registration Form" | "Registration Data";

const tabs: { key: tabType; label: string }[] = [
  { key: "Event Details", label: "Details" },
  { key: "Registration Form", label: "Reg Form" },
  { key: "Registration Data", label: "Reg Data" },
];

function Tabs({
  activeTab,
  changeTab,
}: {
  activeTab: tabType;
  changeTab: (tab: tabType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => changeTab(tab.key)}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              border
              ${
                active
                  ? "bg-[#003c34] text-white border-[#003c34] shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#003c34] hover:text-[#003c34]"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Page() {
  const [tab, setTab] = useState<tabType>("Event Details");
  const [eventId, setEventId] = useState(events[0].id);

  const [event, setEvent] = useState<Event>(events[0]);

  useEffect(() => {
    const selectedEvent = events.find((tmpEvent) => tmpEvent.id === eventId);

    if (selectedEvent) {
      setEvent(selectedEvent);
    }
  }, [eventId]);

  return (
    <div className="min-h-screen bg-[#f5f7f4] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003c34]">Event Dashboard</h1>

          <p className="text-slate-500 mt-2">
            Manage event details, forms, and registrations
          </p>
        </div>

        {/* Top Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <Tabs activeTab={tab} changeTab={setTab} />

            <div className="w-full lg:w-[280px]">
              <div className="border border-slate-300 rounded-xl px-4 py-2 bg-white">
                <DropDown
                  selectedOption={eventId}
                  changeOption={setEventId}
                  options={events}
                />
              </div>
            </div>
          </div>

          {/* Current Section */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="text-2xl font-semibold text-slate-800">{tab}</h2>

            <p className="text-slate-500 mt-1">
              Currently viewing{" "}
              <span className="font-medium text-[#003c34]">{event.name}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-7">
          {tab === "Event Details" && (
            <EventDetails event={event} setEvent={setEvent} />
          )}

          {tab === "Registration Form" && (
            <RegForm event={event} setEvent={setEvent} />
          )}

          {tab === "Registration Data" && (
            <RegData event={event} setEvent={setEvent} />
          )}
        </div>
      </div>
    </div>
  );
}
