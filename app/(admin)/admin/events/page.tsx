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
import { fetchApi } from "@/lib/apiClient";

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

  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [tab, setTab] = useState<tabType>("Event Details");
  const [eventId, setEventId] = useState("");
  const [event, setEvent] = useState<Event | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventHeadEmail, setNewEventHeadEmail] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backendUser = (session as any)?.backendUser;
  
  // Logic to determine if user is Dept Head based on global/department role
  const deptHeadRoles = ["admin", "super_core", "core", "dep_core", "super_coordinator", "coordinator"];
  const isDeptHead = 
    deptHeadRoles.includes(backendUser?.role) ||
    backendUser?.departments?.some((d: any) => deptHeadRoles.includes(d.role));

  const activeRole = isDeptHead ? "Dept Head" : "Event Head";

  // Fetch Events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoadingEvents(true);
        // Call backend API to get events
        const data = await fetchApi("/api/events/");
        
        // Handle null/error response or DRF paginated response
        const apiEventsArray = data ? (data.results ? data.results : (Array.isArray(data) ? data : [])) : [];
        
        // Map backend event structure to frontend Event interface
        const mappedEvents: Event[] = apiEventsArray.map((apiEvent: any) => ({
          id: apiEvent.id,
          name: apiEvent.title,
          // Only lock the form if the backend explicitly marks it as "approved"
          finalLevelApproved: apiEvent.status === "approved" ? [true, mockProfile("Admin")] : "pending",
          firstLevelApproved: apiEvent.status === "approved" || apiEvent.status === "pending_approval" ? [true, mockProfile("Core")] : "pending",
          createdBy: mockProfile(apiEvent.created_by_name || "Unknown"),
          eventTeam: [],
          createdOn: apiEvent.created_at ? apiEvent.created_at.split("T")[0] : "",
          tagline: apiEvent.category_name || "",
          poster: apiEvent.poster || "",
          desc: apiEvent.description || "",
          genre: "Technicals", 
          prizes: [],
          rules: [],
          rounds: [],
          FAQs: [],
          submissionURL: "",
          eventHeadEmail: "", 
          isSubmittedByHead: apiEvent.status === "pending_approval",
        }));
        
        setEventsList(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch events from API, falling back to dummy data", error);
        setEventsList(initialEvents); // Fallback to dummy data if API fails
      } finally {
        setIsLoadingEvents(false);
      }
    };

    if (sessionStatus === "authenticated") {
      loadEvents();
    }
  }, [sessionStatus]);

  useEffect(() => {
    if (eventsList.length > 0) {
      if (!eventId || !eventsList.some((e) => e.id === eventId)) {
        setEventId(eventsList[0].id);
        setEvent(eventsList[0]);
      } else {
        const selectedEvent = eventsList.find((tmpEvent) => tmpEvent.id === eventId);
        if (selectedEvent) {
          setEvent(selectedEvent);
        }
      }
    } else {
      setEventId("");
      setEvent(null);
    }
  }, [eventId, eventsList]);

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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSubmitting(true);

    if (!newEventName.trim() || newEventName.trim().length < 3) {
      setModalError("Valid event name is required (min 3 chars)");
      setIsSubmitting(false);
      return;
    }
    if (!newEventHeadEmail.trim() || !newEventHeadEmail.toLowerCase().endsWith("@ds.study.iitm.ac.in")) {
      setModalError("Valid IITM email is required (@ds.study.iitm.ac.in)");
      setIsSubmitting(false);
      return;
    }

    if (!backendUser?.departments || backendUser.departments.length === 0) {
      setModalError("You are not part of any dep so be part of any dep to create an event");
      setIsSubmitting(false);
      return;
    }

    try {
      // API call to create event
      // Sending default values for required fields like department, category, dates since form doesn't have them yet.
      const payload = {
        title: newEventName.trim(),
        description: "New event description",
        department: backendUser.departments[0].department__id,
        category: null, // Set to null instead of 1 to avoid does_not_exist validation error
        venue: "TBD",
        start_date: new Date(Date.now() + 86400000).toISOString(), // +1 day
        end_date: new Date(Date.now() + 172800000).toISOString(), // +2 days
        registration_deadline: new Date().toISOString(), // today
        capacity: 100,
        fee: 0,
        visibility: "public"
      };

      const createdEvent = await fetchApi("/api/events/", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // After creating, we should also assign the Event Head using the team endpoint
      if (createdEvent && createdEvent.id) {
        try {
          await fetchApi(`/api/events/${createdEvent.id}/team/`, {
            method: "POST",
            body: JSON.stringify({
              email: newEventHeadEmail.trim().toLowerCase(),
              role: "head"
            })
          });
        } catch (teamError) {
          console.error("Failed to assign event head:", teamError);
        }

        // Map and add to state
        const newFrontendEvent: Event = {
          id: createdEvent.id,
          name: createdEvent.title,
          finalLevelApproved: "pending",
          firstLevelApproved: "pending",
          createdBy: mockProfile(session?.user?.name || "Admin"),
          eventTeam: [],
          createdOn: new Date().toISOString().split("T")[0],
          poster: "",
          desc: createdEvent.description,
          genre: "Technicals",
          prizes: [],
          rules: [],
          rounds: [],
          FAQs: [],
          submissionURL: "",
          eventHeadEmail: newEventHeadEmail.trim().toLowerCase(),
          isSubmittedByHead: false,
        };

        setEventsList((prev) => [newFrontendEvent, ...prev]);
        setEventId(newFrontendEvent.id);
        setEvent(newFrontendEvent);
      }
      
      setNewEventName("");
      setNewEventHeadEmail("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating event:", error);
      setModalError("Failed to create event via API.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    if (typeof window !== "undefined") {
      window.location.href = "/admin/sign-in";
    }
    return null;
  }

  const userEmail = session?.user?.email || "";
  if (!userEmail.endsWith("@ds.study.iitm.ac.in")) {
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

          <div className="flex gap-3">
            {activeRole === "Dept Head" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#003c34] hover:bg-[#002d27] px-6 py-3.5 font-semibold text-white shadow-lg transition active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Add Event
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-6 py-3.5 font-semibold text-white shadow-lg transition active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* Top Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <Tabs activeTab={tab} changeTab={setTab} />

            <div className="w-full lg:w-[280px]">
              <div className="border border-slate-300 rounded-xl px-4 py-2 bg-white">
                {eventsList.length > 0 ? (
                  <DropDown
                    selectedOption={eventId}
                    changeOption={setEventId}
                    options={eventsList}
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
            {event ? (
              <p className="text-slate-500 mt-1">
                Currently viewing{" "}
                <span className="font-medium text-[#003c34]">{event.name}</span>
              </p>
            ) : (
              <p className="text-amber-600 mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">warning</span>
                No events are currently available.
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {event && (
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-7">
            {tab === "Event Details" && (
              <EventDetails
                event={event}
                setEvent={handleEventUpdate}
              />
            )}

            {tab === "Registration Form" && (
              <RegForm event={event} setEvent={handleEventUpdate} />
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
              <h3 className="text-xl font-bold text-slate-800">Create New Event</h3>
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#003c34] text-white text-sm font-semibold hover:bg-[#002d27] transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create & Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
