"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import DropDown from "../components/Events/DropDown";
import { events as initialEvents, mockProfile } from "./dummyData";
import RegData from "./sections/RegData";
import EventDetails from "./sections/EventDetails";
import RegForm from "./sections/RegForm";
import Event from "@/interfaces/event";
import Profile from "@/interfaces/profile";

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
  const { data: session, status: sessionStatus } = useSession();

  // State for all events
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);

  const [tab, setTab] = useState<tabType>("Event Details");
  const [eventId, setEventId] = useState(initialEvents[0].id);
  const [event, setEvent] = useState<Event>(initialEvents[0]);

  // Modal states for creating event
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventHeadEmail, setNewEventHeadEmail] = useState("");
  const [modalError, setModalError] = useState("");

<<<<<<< Updated upstream
  useEffect(() => {
    const found = events.find((tmpEvent) => tmpEvent.id === eventId);
    if (found) {
      setEvent(found);
=======
  // Resolve role and email directly from real NextAuth session
  const userEmail = session?.user?.email || "";
  const isEventHead =
    eventsList.some((e) => e.eventHeadEmail === userEmail) ||
    /^[0-9]+[a-z]+/i.test(userEmail) ||
    userEmail.startsWith("24f");

  const activeRole = isEventHead ? "Event Head" : "Dept Head";

  // Get list of events visible to current role
  const visibleEvents = eventsList.filter((tmpEvent) => {
    if (activeRole === "Dept Head") {
      return true; // Dept Head sees all events
>>>>>>> Stashed changes
    }
    // Event Head only sees their assigned events
    return tmpEvent.eventHeadEmail === userEmail;
  });

  // Ensure selected event is valid and visible
  useEffect(() => {
    if (visibleEvents.length > 0) {
      const isCurrentVisible = visibleEvents.some((e) => e.id === eventId);
      if (!isCurrentVisible) {
        // Default to the first visible event
        setEventId(visibleEvents[0].id);
        setEvent(visibleEvents[0]);
      } else {
        const selectedEvent = visibleEvents.find((tmpEvent) => tmpEvent.id === eventId);
        if (selectedEvent) {
          setEvent(selectedEvent);
        }
      }
    } else {
      // No events visible
      setEventId("");
      // Set to dummy empty event object to avoid crashes
      setEvent({
        id: "",
        name: "No Assigned Events",
        finalLevelApproved: "pending",
        firstLevelApproved: "pending",
        createdBy: mockProfile("System"),
        eventTeam: [],
        createdOn: "",
        tagline: "",
        poster: "",
        desc: "",
        genre: "Technicals",
        prizes: [],
        rules: [],
        rounds: [],
        FAQs: [],
        submissionURL: "",
      });
    }
  }, [eventId, activeRole, userEmail, eventsList]);

  // Synchronize changes to current event back to list state
  const handleEventUpdate = (update: Event | ((prev: Event) => Event)) => {
    setEventsList((prevList) => {
      return prevList.map((e) => {
        if (e.id === eventId) {
          const updated = typeof update === "function" ? update(e) : update;
          setEvent(updated);
          return updated;
        }
        return e;
      });
    });
  };

  // Handle creating a new event (Dept Head only)
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!newEventName.trim()) {
      setModalError("Event name is required");
      return;
    }
    if (newEventName.trim().length < 3) {
      setModalError("Event name must be at least 3 characters");
      return;
    }
    if (!newEventHeadEmail.trim()) {
      setModalError("Event Head email is required");
      return;
    }
    // Strict IITM email validation
    if (!newEventHeadEmail.toLowerCase().endsWith("@ds.study.iitm.ac.in")) {
      setModalError("Email must belong to the IITM organization (@ds.study.iitm.ac.in)");
      return;
    }

    // Create the new event object
    const createdByProfile: Profile = mockProfile(
      session?.user?.name || "Dept Head User",
      "Dept Head"
    );
    if (session?.user?.email) {
      createdByProfile.email = session.user.email;
    }

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      name: newEventName.trim(),
      finalLevelApproved: "pending",
      firstLevelApproved: "pending",
      createdBy: createdByProfile,
      eventTeam: [
        {
          name: "Assigned Event Head",
          email: newEventHeadEmail.trim().toLowerCase(),
          level: "Diploma",
          program: "Data Science",
          mobile: 0,
          state: "",
          academic_status: "Standalone",
          pos: "Event Head",
        },
      ],
      eventHeadEmail: newEventHeadEmail.trim().toLowerCase(),
      isSubmittedByHead: false,
      createdOn: new Date().toISOString().split("T")[0],
      tagline: "",
      poster: "",
      desc: "",
      genre: "Technicals",
      rules: [],
      rounds: [],
      FAQs: [],
      prizes: [
        { id: "p1", position: 1, prize: "" },
        { id: "p2", position: 2, prize: "" },
        { id: "p3", position: 3, prize: "" },
      ],
      submissionURL: "",
    };

    setEventsList((prev) => [newEvent, ...prev]);
    setEventId(newEvent.id);
    setEvent(newEvent);

    // Reset form and close modal
    setNewEventName("");
    setNewEventHeadEmail("");
    setShowAddModal(false);
  };

  // Enforce session check
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#f5f7f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#003c34] border-t-transparent" />
          <p className="text-slate-600 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    // Redirect to sign in page
    if (typeof window !== "undefined") {
      window.location.href = "/admin/sign-in";
    }
    return null;
  }

  // Double check email validation just in case (uses userEmail defined above)
  const isEmailValid = userEmail.endsWith("@ds.study.iitm.ac.in");

  if (!isEmailValid) {
    return (
      <div className="min-h-screen bg-[#f5f7f4] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-200 p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
            <span className="material-symbols-outlined text-3xl">gpp_bad</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Restricted</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Only authorized members with an organization email ending in
            <strong className="text-red-600"> @ds.study.iitm.ac.in</strong> can access the Admin Panel.
          </p>
          <button
            onClick={() => signOut()}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
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
=======
    <div className="min-h-screen bg-[#f5f7f4] p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#003c34]">Event Dashboard</h1>
            <p className="text-slate-500 mt-2">
              Manage event details, forms, and registrations
            </p>
          </div>

          {/* Add Event Button (Dept Head Only) */}
          {activeRole === "Dept Head" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#003c34] hover:bg-[#002d27] px-6 py-3.5 font-semibold text-white shadow-lg transition active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Add Event
            </button>
          )}
        </div>

        {/* Top Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <Tabs activeTab={tab} changeTab={setTab} />

            <div className="w-full lg:w-[280px]">
              <div className="border border-slate-300 rounded-xl px-4 py-2 bg-white">
                {visibleEvents.length > 0 ? (
                  <DropDown
                    selectedOption={eventId}
                    changeOption={setEventId}
                    options={visibleEvents}
                  />
                ) : (
                  <span className="text-sm text-slate-400 font-medium block text-center">No Events Available</span>
                )}
              </div>
            </div>
          </div>

          {/* Current Section */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="text-2xl font-semibold text-slate-800">{tab}</h2>
            {visibleEvents.length > 0 ? (
              <p className="text-slate-500 mt-1">
                Currently viewing{" "}
                <span className="font-medium text-[#003c34]">{event.name}</span>
              </p>
            ) : (
              <p className="text-amber-600 mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">warning</span>
                No events are currently assigned to you.
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {visibleEvents.length > 0 && (
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-7">
            {tab === "Event Details" && (
              <EventDetails
                event={event}
                setEvent={handleEventUpdate}
                userRole={activeRole}
                userEmail={simulatedEmail}
              />
            )}

            {tab === "Registration Form" && (
              <RegForm event={event} />
            )}

            {tab === "Registration Data" && (
              <RegData event={event} setEvent={handleEventUpdate} />
            )}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-800">Assign New Event</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setModalError("");
                }}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Name</label>
                <input
                  type="text"
                  placeholder="e.g. Algorithmic Coding"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-[#003c34] focus:ring-1 focus:ring-[#003c34] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Head Email</label>
                <input
                  type="email"
                  placeholder="e.g. headname@ds.study.iitm.ac.in"
                  value={newEventHeadEmail}
                  onChange={(e) => setNewEventHeadEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-[#003c34] focus:ring-1 focus:ring-[#003c34] transition"
                  required
                />
                <span className="text-xs text-slate-400 mt-1 block">Must be an organization email ending in @ds.study.iitm.ac.in</span>
              </div>

              {modalError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">
                  {modalError}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setModalError("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#003c34] text-white text-sm font-semibold hover:bg-[#002d27] transition"
                >
                  Create & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
>>>>>>> Stashed changes
      )}
    </div>
  );
}
