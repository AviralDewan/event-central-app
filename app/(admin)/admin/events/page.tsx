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
    <div className="flex gap-3 md:gap-5 lg:gap-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`px-5 py-3 rounded-md cursor-pointer ${
            activeTab === tab.key
              ? "bg-[#003c34] text-white"
              : "bg-[#F8FBE4] text-slate-600"
          }`}
          onClick={() => {
            console.log(tab.key);
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
    setEvent(events.find((tmpEvent) => tmpEvent.id === eventId));
  }, [eventId]);

  return (
    <div className="w-full p-3 md:p-5">
      <Tabs activeTab={tab} changeTab={setTab} />
      <div className="mt-7 w-[250px] border border-black px-4 py-2 rounded-md">
        <DropDown
          selectedOption={eventId}
          changeOption={setEventId}
          options={events}
        />
      </div>

      <p className="mt-3 text-xl font-medium">
        {tab} for {event.name}
      </p>

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
