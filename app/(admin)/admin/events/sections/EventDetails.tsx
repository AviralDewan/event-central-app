"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import DropDown from "../../components/Events/DropDown";
import Section from "../../components/Events/Section";
import { events } from "../dummyData";
import Event, { FAQ } from "@/interfaces/event";
import Input from "../../components/Events/Input";
import FAQField from "../../components/Events/FAQField";
import RoundField from "../../components/Events/RoundField";
import Profile from "@/interfaces/profile";
import { mockProfile } from "../dummyData";
import { fetchApi } from "@/lib/apiClient";

const MAX_RULES = 20;
const MAX_ROUNDS = 10;
const MAX_FAQS = 15;

export default function EventDetails({
  event,
  setEvent,
  userRole,
  userEmail,
}: {
  event: Event;
  setEvent: Dispatch<SetStateAction<Event>> | any;
  userRole: "Dept Head" | "Event Head";
  userEmail: string;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [posterPreviewError, setPosterPreviewError] = useState(false);

  // =========================
  // LIFE CYCLE / WORKFLOW STATUS
  // =========================
  const isApproved = Array.isArray(event?.finalLevelApproved) && event.finalLevelApproved[0] === true;
  const isRejected = (Array.isArray(event?.finalLevelApproved) && event.finalLevelApproved[0] === false) ||
                     (Array.isArray(event?.firstLevelApproved) && event.firstLevelApproved[0] === false);
  const status = isApproved ? "Approved" : isRejected ? "Rejected" : "Pending";

  const isFieldDisabled = (fieldName: string) => {
    if (status === "Approved") return true;
    if (userRole === "Event Head") {
      if (fieldName === "name" || fieldName === "eventHeadEmail") return true;
      if (event.isSubmittedByHead) return true;
    }
    return false;
  };

  // =========================
  // HELPERS
  // =========================
  const sanitize = (value: string) => value.trim();

  const isValidURL = (url: string) => {
    try {
      const parsed = new URL(url);
      return (
        (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        !!parsed.hostname
      );
    } catch {
      return false;
    }
  };

  const isValidPrize = (value: string) => {
    return /^[\w\s₹$,+\-().]+$/i.test(value);
  };

  const scrollToError = (fieldId: string) => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // =========================
  // VALIDATE FIELD
  // =========================
  const validateField = (
    field: string,
    value: string | boolean | number | undefined
  ) => {
    let error = "";

    switch (field) {
      case "name":
        if (!String(value || "").trim()) {
          error = "Event name is required";
        } else if (String(value).trim().length < 3) {
          error = "Event name must be at least 3 characters";
        } else if (String(value).trim().length > 80) {
          error = "Event name cannot exceed 80 characters";
        }
        break;

      case "eventHeadEmail":
        if (!String(value || "").trim()) {
          error = "Event Head Email is required";
        } else if (!String(value).toLowerCase().endsWith("@ds.study.iitm.ac.in")) {
          error = "Email must end with @ds.study.iitm.ac.in";
        }
        break;

      case "tagline":
        if (value && String(value).trim().length > 80) {
          error = "Tagline should be under 80 characters";
        }
        break;

      case "poster":
        if (!String(value || "").trim()) {
          error = "Poster URL is required";
        } else if (!isValidURL(String(value))) {
          error = "Enter valid poster URL";
        }
        break;

      case "submissionURL":
        if (!String(value || "").trim()) {
          error = "Submission URL is required";
        } else if (!isValidURL(String(value))) {
          error = "Enter valid submission URL";
        }
        break;

      case "desc":
        if (!String(value || "").trim()) {
          error = "Description is required";
        } else if (String(value).trim().length < 20) {
          error = "Description should be at least 20 characters";
        } else if (String(value).trim().length > 2000) {
          error = "Description cannot exceed 2000 characters";
        }
        break;

      case "genre":
        if (!value) {
          error = "Genre is required";
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error;
  };

  // =========================
  // UPDATE HELPERS
  // =========================
  const updateEvent = (property: string, value: any) => {
    setEvent((prev: Event) => ({
      ...prev,
      [property]: value,
    }));
    validateField(property, value);
  };

  const updatePrize = (idx: number, val: string) => {
    const updatedPrizes = [...event.prizes];
    updatedPrizes[idx].prize = val;
    setEvent((prev: Event) => ({
      ...prev,
      prizes: updatedPrizes,
    }));
  };

  const updateRule = (idx: number, rule: string) => {
    const updatedRules = [...event.rules];
    updatedRules[idx] = sanitize(rule);
    setEvent((prev: Event) => ({
      ...prev,
      rules: updatedRules,
    }));
  };

  const updateFAQ = (idx: number, field: string, val: string) => {
    const updatedFAQs = [...event.FAQs];
    updatedFAQs[idx] = {
      ...updatedFAQs[idx],
      [field]: sanitize(val),
    };
    setEvent((prev: Event) => ({
      ...prev,
      FAQs: updatedFAQs,
    }));
  };

  const updateRound = (
    idx: number,
    type: "startDate" | "endDate" | "desc",
    val: string,
    date: string
  ) => {
    const updatedRounds = [...event.rounds];
    if (type === "desc") {
      updatedRounds[idx].desc = sanitize(val);
    } else if (type === "startDate") {
      updatedRounds[idx].startDate = date;
    } else {
      updatedRounds[idx].endDate = date;
    }
    setEvent((prev: Event) => ({
      ...prev,
      rounds: updatedRounds,
    }));
  };

  // =========================
  // FORM COMPLETION
  // =========================
  const completionPercentage = useMemo(() => {
    let total = 5;
    let completed = 0;
    if (event.name?.trim()) completed++;
    if (event.poster?.trim()) completed++;
    if (event.desc?.trim()) completed++;
    if (event.submissionURL?.trim()) completed++;
    if (event.genre) completed++;
    return Math.round((completed / total) * 100);
  }, [event]);

  // =========================
  // RUN FULL VALIDATION & SAVE
  // =========================
  const runFullValidationAndSave = async (isSubmitting: boolean): Promise<boolean> => {
    const newErrors: ErrorState = {};

    // =========================
    // BASIC VALIDATION
    // =========================
    const fields = ["name", "poster", "submissionURL", "desc", "genre", "tagline"];
    if (userRole === "Dept Head") {
      fields.push("eventHeadEmail");
    }

    for (const field of fields) {
      const error = validateField(field, event[field as keyof Event] as any);
      if (error) {
        newErrors[field] = error;
      }
    }

    // =========================
    // PRIZE VALIDATION
    // =========================
    const firstPrize = event.prizes.find((p) => p.position === 1);
    const secondPrize = event.prizes.find((p) => p.position === 2);
    const thirdPrize = event.prizes.find((p) => p.position === 3);

    if (secondPrize?.prize?.trim() && !firstPrize?.prize?.trim()) {
      newErrors["prize-2"] = "Add 1st prize before adding 2nd prize";
    }
    if (thirdPrize?.prize?.trim() && !secondPrize?.prize?.trim()) {
      newErrors["prize-3"] = "Add 2nd prize before adding 3rd prize";
    }
    event.prizes.forEach((prize) => {
      if (prize.prize.trim() && !isValidPrize(prize.prize)) {
        newErrors[`prize-${prize.position}`] = "Invalid prize format";
      }
    });

    // =========================
    // RULE VALIDATION
    // =========================
    const cleanedRules = event.rules.map((r) => r.trim()).filter(Boolean);
    const uniqueRules = new Set(cleanedRules);
    if (cleanedRules.length !== uniqueRules.size) {
      newErrors["rules"] = "Duplicate rules are not allowed";
    }
    cleanedRules.forEach((rule, idx) => {
      if (rule.length < 5) {
        newErrors[`rule-${idx}`] = "Rule should be at least 5 characters";
      }
      if (rule.length > 200) {
        newErrors[`rule-${idx}`] = "Rule cannot exceed 200 characters";
      }
    });

    // =========================
    // FAQ VALIDATION
    // =========================
    const faqQuestions = new Set();
    for (let i = 0; i < event.FAQs.length; i++) {
      const faq = event.FAQs[i];
      if (faq.answer.trim() && !faq.question.trim()) {
        newErrors[`faq-question-${i}`] = "Question is required";
      }
      if (faq.question.trim() && !faq.answer.trim()) {
        newErrors[`faq-answer-${i}`] = "Answer is required";
      }
      if (faq.question.length > 120) {
        newErrors[`faq-question-${i}`] = "Question too long";
      }
      if (faq.answer.length > 500) {
        newErrors[`faq-answer-${i}`] = "Answer too long";
      }
      if (faq.question.trim() && !faq.question.trim().endsWith("?")) {
        newErrors[`faq-question-${i}`] = "Question should end with ?";
      }
      if (faq.question.trim()) {
        const normalized = faq.question.trim().toLowerCase();
        if (faqQuestions.has(normalized)) {
          newErrors[`faq-duplicate-${i}`] = "Duplicate FAQ question";
        }
        faqQuestions.add(normalized);
      }
    }

    // =========================
    // ROUND VALIDATION
    // =========================
    for (let i = 0; i < event.rounds.length; i++) {
      const round = event.rounds[i];
      const hasData = round.desc.trim() || round.startDate || round.endDate;
      if (!hasData) continue;

      if (!round.desc.trim()) {
        newErrors[`round-desc-${i}`] = `Round ${i + 1}: Description required`;
      }
      if (!round.startDate) {
        newErrors[`round-start-${i}`] = `Round ${i + 1}: Start date required`;
      }
      if (!round.endDate) {
        newErrors[`round-end-${i}`] = `Round ${i + 1}: End date required`;
      }

      if (round.startDate && round.endDate) {
        const start = new Date(round.startDate);
        const end = new Date(round.endDate);
        const now = new Date();

        if (start > end) {
          newErrors[`round-date-${i}`] = `Round ${i + 1}: Invalid date range`;
        }
        if (start < now) {
          newErrors[`round-start-${i}`] = "Round cannot start in the past";
        }
        const duration = end.getTime() - start.getTime();
        const days = duration / (1000 * 60 * 60 * 24);
        if (days > 30) {
          newErrors[`round-date-${i}`] = "Round duration too long";
        }
      }

      if (i > 0) {
        const prevRound = event.rounds[i - 1];
        const prevComplete = prevRound.desc.trim() && prevRound.startDate && prevRound.endDate;
        if (!prevComplete && hasData) {
          newErrors[`round-sequence-${i}`] = `Complete Round ${i} before Round ${i + 1}`;
        }
        if (prevRound.endDate && round.startDate) {
          const prevEnd = new Date(prevRound.endDate);
          const currentStart = new Date(round.startDate);
          if (currentStart < prevEnd) {
            newErrors[`round-overlap-${i}`] = `Round ${i + 1} overlaps previous round`;
          }
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      scrollToError(firstErrorKey);
      return false;
    }

    const sanitizedEvent: Event = {
      ...event,
      name: sanitize(event.name),
      tagline: sanitize(event.tagline || ""),
      desc: sanitize(event.desc),
      poster: sanitize(event.poster),
      submissionURL: sanitize(event.submissionURL),
      rules: event.rules.map((r) => r.trim()).filter(Boolean),
      FAQs: event.FAQs.filter((faq) => faq.question.trim() && faq.answer.trim()),
      rounds: event.rounds.filter((round) => round.desc.trim() && round.startDate && round.endDate),
      isSubmittedByHead: isSubmitting ? true : event.isSubmittedByHead,
    };

    setEvent(sanitizedEvent);
    return true;
  };

  // =========================
  // SUBMIT (Dept Head)
  // =========================
  const submitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setSuccessMessage("");
    try {
      setLoading(true);
      const success = await runFullValidationAndSave(false);
      if (success) {
        // API call to update event
        await fetchApi(`/api/events/${event.id}/`, {
          method: "PATCH",
          body: JSON.stringify({
            title: event.name,
            description: event.desc,
            poster: event.poster,
            // Add other fields as necessary based on API
          })
        });
        setSuccessMessage("Event updated successfully");
      }
    } catch (err) {
      console.error(err);
      setErrors({ name: "API Error: Could not save event." });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // WORKFLOW ACTION HANDLERS (Event Head)
  // =========================
  const handleSaveDraft = async () => {
    if (loading) return;
    setSuccessMessage("");
    try {
      setLoading(true);
      if (!event.name?.trim()) {
        setErrors({ name: "Event name is required" });
        scrollToError("name");
        return;
      }
      const updatedEvent: Event = {
        ...event,
        name: sanitize(event.name),
        tagline: sanitize(event.tagline || ""),
        desc: sanitize(event.desc || ""),
        poster: sanitize(event.poster || ""),
        submissionURL: sanitize(event.submissionURL || ""),
        isSubmittedByHead: false, // Explicitly keeping it as a draft
      };
      
      // Save draft to API
      await fetchApi(`/api/events/${event.id}/`, {
          method: "PATCH",
          body: JSON.stringify({
            title: updatedEvent.name,
            description: updatedEvent.desc,
            poster: updatedEvent.poster,
          })
      });

      setEvent(updatedEvent);
      setSuccessMessage("Draft changes saved successfully.");
    } catch (err) {
      console.error(err);
      setErrors({ name: "API Error: Could not save draft." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (loading) return;
    setSuccessMessage("");
    try {
      setLoading(true);
      const success = await runFullValidationAndSave(true);
      if (success) {
        // First update the event
        await fetchApi(`/api/events/${event.id}/`, {
          method: "PATCH",
          body: JSON.stringify({
            title: event.name,
            description: event.desc,
            poster: event.poster,
          })
        });
        // Then submit for approval
        await fetchApi(`/api/events/${event.id}/submit/`, {
          method: "POST"
        });
        setSuccessMessage("Event submitted successfully. Waiting for Department Head approval.");
      }
    } catch (err) {
      console.error(err);
      setErrors({ name: "API Error: Could not submit event." });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STYLE DEFINITIONS
  // =========================
  const statusStyles = {
    Pending: "bg-amber-100 text-amber-750 border border-amber-250",
    Approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Rejected: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <form
      onSubmit={submitEvent}
      className="max-z-50 w-full bg-zinc-50 min-h-screen"
    >
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">
                Event Details
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Manage and update your event professionally.
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyles[status]}`}
            >
              {status} {event.isSubmittedByHead && status === "Pending" ? "(Review Needed)" : ""}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-600">
                Completion
              </span>
              <span className="text-sm font-semibold text-zinc-900">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${completionPercentage}%`,
                }}
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#003c34]
                  to-teal-755
                  transition-all
                  duration-500
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 md:px-8 py-8 space-y-8">
        {/* SUCCESS */}
        {successMessage && (
          <div className="rounded-2xl border border-emerald-250 bg-emerald-50 px-5 py-4 text-emerald-800 font-semibold shadow-sm">
            {successMessage}
          </div>
        )}

        {/* WORKFLOW DECISION CARD (Dept Head Only) */}
        {userRole === "Dept Head" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className={`material-symbols-outlined text-3xl ${
                  status === "Approved" ? "text-emerald-600" :
                  status === "Rejected" ? "text-red-600" :
                  event.isSubmittedByHead ? "text-amber-500 animate-pulse" : "text-slate-400"
                }`}>
                  {status === "Approved" ? "verified" :
                   status === "Rejected" ? "cancel" :
                   event.isSubmittedByHead ? "pending_actions" : "hourglass_empty"}
                </span>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    Approval Workflow
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {status === "Approved"
                      ? "Approved by Department Head. Status: Finalized."
                      : status === "Rejected"
                      ? "Rejected by Department Head. Status: Needs revision."
                      : event.isSubmittedByHead
                      ? `Submitted by Event Head (${event.eventHeadEmail}) and pending review.`
                      : `Event Head (${event.eventHeadEmail || "unassigned"}) is currently preparing event details.`}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Dept Head */}
              {status === "Pending" && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const reviewer: Profile = mockProfile(userEmail.split("@")[0], "Dept Head");
                      reviewer.email = userEmail;
                      setEvent((prev: Event) => ({
                        ...prev,
                        finalLevelApproved: [false, reviewer],
                        isSubmittedByHead: false, // Reset submission status so Event Head can edit again
                      }));
                      setSuccessMessage("Event rejected. Sent back to the Event Head for corrections.");
                    }}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                  >
                    Reject Event
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const reviewer: Profile = mockProfile(userEmail.split("@")[0], "Dept Head");
                      reviewer.email = userEmail;
                      setEvent((prev: Event) => ({
                        ...prev,
                        finalLevelApproved: [true, reviewer],
                      }));
                      setSuccessMessage("Event approved successfully.");
                    }}
                    className="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow transition"
                  >
                    Approve & Save
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BASIC INFO */}
        <Section customStyles="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">
              Basic Information
            </h2>
            <p className="text-zinc-500 mt-2">
              This information will be publicly visible.
            </p>
          </div>

          <div className="space-y-7">
            <div id="name">
              <Input
                placeholder="Enter Event Name"
                value={event.name}
                changeValue={(val) => updateEvent("name", val)}
                label="Event Name"
                required={true}
                textArea={false}
                disabled={isFieldDisabled("name")}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div id="eventHeadEmail">
              <Input
                placeholder="Enter Event Head Email"
                value={event.eventHeadEmail || ""}
                changeValue={(val) => updateEvent("eventHeadEmail", val)}
                label="Event Head Email"
                required={true}
                textArea={false}
                disabled={isFieldDisabled("eventHeadEmail")}
              />
              {errors.eventHeadEmail && (
                <p className="mt-2 text-sm text-red-500">{errors.eventHeadEmail}</p>
              )}
            </div>

            <div id="tagline">
              <Input
                placeholder="Enter Tagline"
                value={event.tagline}
                changeValue={(val) => updateEvent("tagline", val)}
                label="Tagline"
                required={false}
                textArea={false}
                disabled={isFieldDisabled("tagline")}
              />
              <div className="flex justify-end mt-2">
                <span className="text-xs text-zinc-400">
                  {event.tagline?.length || 0}/80
                </span>
              </div>
              {errors.tagline && (
                <p className="mt-2 text-sm text-red-500">{errors.tagline}</p>
              )}
            </div>

            <div id="poster">
              <Input
                placeholder="Enter Poster URL"
                value={event.poster}
                changeValue={(val) => updateEvent("poster", val)}
                label="Poster URL"
                required={true}
                textArea={false}
                disabled={isFieldDisabled("poster")}
              />
              {event.poster && isValidURL(event.poster) && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
                  <img
                    src={event.poster}
                    alt="Poster Preview"
                    onLoad={() => setPosterPreviewError(false)}
                    onError={() => setPosterPreviewError(true)}
                    className="w-full h-[280px] object-cover"
                  />
                </div>
              )}
              {posterPreviewError && (
                <p className="mt-2 text-sm text-red-500">
                  Unable to load poster image
                </p>
              )}
              {errors.poster && (
                <p className="mt-2 text-sm text-red-500">{errors.poster}</p>
              )}
            </div>

            <div id="desc">
              <Input
                placeholder="Enter Event Description"
                value={event.desc}
                changeValue={(val) => updateEvent("desc", val)}
                label="Description"
                required={true}
                textArea={true}
                disabled={isFieldDisabled("desc")}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.desc ? (
                  <p className="text-sm text-red-500">{errors.desc}</p>
                ) : (
                  <p className="text-sm text-zinc-400">
                    Minimum 20 characters required
                  </p>
                )}
                <span className="text-xs text-zinc-400">
                  {event.desc?.length || 0}/2000
                </span>
              </div>
            </div>

            <div id="submissionURL">
              <Input
                placeholder="Enter Submission URL"
                value={event.submissionURL}
                changeValue={(val) => updateEvent("submissionURL", val)}
                label="Submission URL"
                required={true}
                textArea={false}
                disabled={isFieldDisabled("submissionURL")}
              />
              {errors.submissionURL && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.submissionURL}
                </p>
              )}
            </div>

            <div id="genre">
              <label className="text-sm font-semibold text-zinc-700 mb-2 block">
                Event Genre
              </label>
              <div className="rounded-2xl border border-zinc-350 px-4 py-3 bg-white focus-within:ring-4 focus-within:ring-zinc-200 transition">
                <DropDown
                  options={[
                    { id: "Technicals", name: "Technicals" },
                    { id: "Culturals", name: "Culturals" },
                    { id: "Sports", name: "Sports" },
                  ]}
                  selectedOption={event.genre}
                  changeOption={(option) => updateEvent("genre", option)}
                  disabled={isFieldDisabled("genre")}
                />
              </div>
              {errors.genre && (
                <p className="mt-2 text-sm text-red-500">{errors.genre}</p>
              )}
            </div>
          </div>
        </Section>

        {/* PRIZES */}
        <Section customStyles="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">Prizes</h2>
            <p className="text-zinc-500 mt-2">
              Reward structure for participants.
            </p>
          </div>
          <div className="space-y-6">
            {event.prizes.map((prize, idx) => (
              <div key={prize.id || idx}>
                <Input
                  placeholder={`Prize for #${prize.position}`}
                  value={prize.prize}
                  changeValue={(e: string) => updatePrize(idx, e)}
                  required={false}
                  label={`Prize #${prize.position}`}
                  textArea={false}
                  disabled={isFieldDisabled("prizes")}
                />
                {errors[`prize-${prize.position}`] && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors[`prize-${prize.position}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* RULES */}
        <Section customStyles="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">Rules</h2>
              <p className="text-zinc-500 mt-2">
                Guidelines participants must follow.
              </p>
            </div>
            <button
              type="button"
              disabled={event.rules.length >= MAX_RULES || isFieldDisabled("rules")}
              onClick={() =>
                setEvent((prev: Event) => ({
                  ...prev,
                  rules: [...prev.rules, ""],
                }))
              }
              className="rounded-xl bg-[#003c34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002d27] transition disabled:opacity-50"
            >
              Add Rule
            </button>
          </div>

          <div className="space-y-5">
            {event.rules.map((rule, idx) => (
              <div key={idx}>
                <Input
                  placeholder="Enter Rule"
                  value={rule}
                  changeValue={(e: string) => updateRule(idx, e)}
                  required={false}
                  label={`Rule #${idx + 1}`}
                  textArea={false}
                  disabled={isFieldDisabled("rules")}
                />
                <div className="flex justify-between mt-2">
                  {errors[`rule-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`rule-${idx}`]}
                    </p>
                  )}
                  <span className="text-xs text-zinc-400 ml-auto">
                    {rule.length}/200
                  </span>
                </div>
              </div>
            ))}
            {errors.rules && (
              <p className="text-sm text-red-500">{errors.rules}</p>
            )}
          </div>
        </Section>

        {/* ROUNDS */}
        <Section customStyles="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">Event Rounds</h2>
              <p className="text-zinc-500 mt-2">
                Define round timelines and details.
              </p>
            </div>
            <button
              type="button"
              disabled={event.rounds.length >= MAX_ROUNDS || isFieldDisabled("rounds")}
              onClick={() =>
                setEvent((prev: Event) => ({
                  ...prev,
                  rounds: [
                    ...prev.rounds,
                    {
                      id: "",
                      roundNumber: prev.rounds.length + 1,
                      desc: "",
                      startDate: "",
                      endDate: "",
                    },
                  ],
                }))
              }
              className="rounded-xl bg-[#003c34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002d27] transition disabled:opacity-50"
            >
              Add Round
            </button>
          </div>

          <div className="relative pl-6 space-y-10">
            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-zinc-200" />
            {event.rounds.map((round, idx) => (
              <div key={round.id || idx} className="relative">
                <div className="absolute -left-[30px] top-3 h-4 w-4 rounded-full bg-zinc-900" />
                <RoundField
                  round={round}
                  idx={idx}
                  updateRound={updateRound}
                  disabled={isFieldDisabled("rounds")}
                />
                <div className="mt-2 space-y-1">
                  {errors[`round-desc-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`round-desc-${idx}`]}
                    </p>
                  )}
                  {errors[`round-start-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`round-start-${idx}`]}
                    </p>
                  )}
                  {errors[`round-end-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`round-end-${idx}`]}
                    </p>
                  )}
                  {errors[`round-date-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`round-date-${idx}`]}
                    </p>
                  )}
                  {errors[`round-sequence-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`round-sequence-${idx}`]}
                    </p>
                  )}
                  {errors[`round-overlap-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`round-overlap-${idx}`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        <Section customStyles="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">FAQs</h2>
              <p className="text-zinc-500 mt-2">
                Common participant questions.
              </p>
            </div>
            <button
              type="button"
              disabled={event.FAQs.length >= MAX_FAQS || isFieldDisabled("FAQs")}
              onClick={() =>
                setEvent((prev: Event) => ({
                  ...prev,
                  FAQs: [
                    ...prev.FAQs,
                    {
                      id: "",
                      question: "",
                      answer: "",
                    },
                  ],
                }))
              }
              className="rounded-xl bg-[#003c34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002d27] transition disabled:opacity-50"
            >
              Add FAQ
            </button>
          </div>

          <div className="space-y-6">
            {event.FAQs.map((faq, idx) => (
              <div key={faq.id || idx}>
                <FAQField
                  idx={idx}
                  faq={faq}
                  updateFAQ={updateFAQ}
                  disabled={isFieldDisabled("FAQs")}
                />
                <div className="space-y-1 mt-2">
                  {errors[`faq-question-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`faq-question-${idx}`]}
                    </p>
                  )}
                  {errors[`faq-answer-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`faq-answer-${idx}`]}
                    </p>
                  )}
                  {errors[`faq-duplicate-${idx}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`faq-duplicate-${idx}`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* SAVE BAR */}
      <div className="sticky bottom-0 z-50 border-t border-zinc-200 bg-white/90 backdrop-blur-xl px-4 md:px-8 py-4 flex gap-4">
        {userRole === "Event Head" ? (
          <>
            <button
              type="button"
              disabled={loading || isFieldDisabled("desc")}
              onClick={handleSaveDraft}
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={loading || isFieldDisabled("desc")}
              onClick={handleSubmitForApproval}
              className="flex-1 rounded-2xl bg-[#003c34] px-6 py-4 text-lg font-semibold text-white hover:bg-[#002d27] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={loading || status === "Approved"}
            className="w-full rounded-2xl bg-zinc-900 px-6 py-4 text-lg font-semibold text-white hover:bg-zinc-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving Event...
              </div>
            ) : status === "Approved" ? (
              "Event Details Approved (Locked)"
            ) : (
              "Save Changes"
            )}
          </button>
        )}
      </div>
    </form>
  );
}
