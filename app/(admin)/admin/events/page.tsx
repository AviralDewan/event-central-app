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
  { key: "Event Details", label: "Event Page" },
  { key: "Registration Form", label: "Registration Form" },
  { key: "Registration Data", label: "Registration Data" },
];

function Tabs({
  activeTab,
  changeTab,
}: {
  activeTab: tabType;
  changeTab: (tab: tabType) => void;
}) {
  return (
    <div className="bg-[#0c0c0c] border border-zinc-850 p-1 rounded-lg flex items-center gap-1 w-fit select-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === tab.key
              ? "bg-white text-black shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
          onClick={() => {
            changeTab(tab.key);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function Page() {
  const [tab, setTab] = useState<tabType>("Event Details");
  const [eventId, setEventId] = useState(events[0].id);

  const [event, setEvent] = useState<Event>(events[0]);

  useEffect(() => {
    const found = events.find((tmpEvent) => tmpEvent.id === eventId);
    if (found) {
      setEvent(found);
    }
  }, [eventId]);

  return (
    <div className="w-full p-4 md:p-6 flex flex-col">
      <Tabs activeTab={tab} changeTab={setTab} />
      <div className="mt-6 w-[250px] border border-zinc-850 px-4 py-2 rounded-md bg-[#030303]">
        <DropDown
          selectedOption={eventId}
          changeOption={setEventId}
          options={events}
        />
      </div>

      {tab === "Event Details" && (
        <p className="mt-5 text-xl font-bold text-white">
          Event Details for {event.name}
        </p>
      )}

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
  );
}
