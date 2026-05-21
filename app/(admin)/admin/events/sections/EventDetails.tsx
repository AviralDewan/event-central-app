"use client";

import { useState } from "react";
import DropDown from "../../components/Events/DropDown";
import Section from "../../components/Events/Section";
import { events } from "../dummyData";
import Event, { FAQ } from "@/interfaces/event";
import Input from "../../components/Events/Input";
import FAQField from "../../components/Events/FAQField";
import RoundField from "../../components/Events/RoundField";

export default function EventDetails({
  event,
  setEvent,
}: {
  event: Event;
  setEvent: (event: Event) => void;
}) {
  const updateFAQ = (idx: number, field: string, val: string) => {
    const updatedFAQs = [...event.FAQs];
    updatedFAQs[idx] = { ...updatedFAQs[idx], [field]: val };
    setEvent((event) => ({ ...event, FAQs: updatedFAQs }));
  };

  const updateRule = (idx: number, rule: string) => {
    const updatedRules = [...event.rules];
    updatedRules[idx] = rule;
    setEvent((event) => ({ ...event, ["rules"]: updatedRules }));
  };

  const updateEvent = (property: string, value: any) => {
    setEvent((event) => ({
      ...event,
      [property]: value,
    }));
  };

  const updatePrize = (idx: number, val: string) => {
    const updatedPrizes = [...event.prizes];
    updatedPrizes[idx].prize = val;
    setEvent((event) => ({ ...event, ["prizes"]: updatedPrizes }));
  };

  const updateRound = (
    idx: number,
    type: "startDate" | "endDate" | "desc",
    val: string,
    date: string
  ) => {
    const updatedRounds = [...event.rounds];
    if (type === "desc") updatedRounds[idx].desc = val;
    else if (type === "startDate") updatedRounds[idx].startDate = date;
    else updatedRounds[idx].endDate = date;

    setEvent((event) => ({ ...event, ["rounds"]: updatedRounds }));
  };

  const submitEvent = (e: any) => {
    e.preventDefault();

    alert("Event updated");
  };

  return (
    <form>
      <div className="w-full flex justify-between">
        <p className="mt-5">
          {((event?.firstLevelApproved === "pending" &&
            event?.finalLevelApproved === "pending") ||
            (event?.firstLevelApproved != "pending" &&
              event?.finalLevelApproved === "pending")) && (
            <span className="bg-slate-600 text-white px-5 py-2 text-md rounded-full">
              Pending
            </span>
          )}
          {(event?.firstLevelApproved[0] === false ||
            event?.finalLevelApproved[0] === false) && (
            <span className="bg-red-500 text-white px-5 py-2 text-md rounded-full">
              Rejected
            </span>
          )}
          {event?.finalLevelApproved[0] === true && (
            <span className="bg-green-500 text-white px-5 py-2 text-md rounded-full">
              Approved
            </span>
          )}
        </p>

        {/* based on user position/perms enable first/final approval */}

        {/* <DropDown
          options={[
            { id: "FinalLevelApproved", name: "Approve at Final Level" },
            { id: "FinalLevelRejected", name: "Reject at Final Level" },
            { id: "Pending", name: "Mark for Review later" },
          ]}
        /> */}
      </div>
      <Section customStyles="mt-10">
        <Input
          placeholder="Enter Event Name"
          value={event.name}
          changeValue={(val) => updateEvent("name", val)}
          label="Event Name"
          required={true}
          textArea={false}
        />
        <Input
          placeholder="Enter Tagline for your Event"
          value={event.tagline}
          changeValue={(val) => updateEvent("tagline", val)}
          label="Tagline"
          required={false}
          textArea={false}
        />
        <Input
          placeholder="Enter Public link for Poster"
          value={event.poster}
          changeValue={(val) => updateEvent("poster", val)}
          label="Event Poster"
          required={true}
          textArea={false}
        />
        <Input
          placeholder="Enter Event Description"
          value={event.desc}
          changeValue={(val) => updateEvent("desc", val)}
          label="Event Description for Participants"
          required={true}
          textArea={true}
        />
        <Input
          placeholder="Enter Event Submission Form URL"
          value={event.submissionURL}
          changeValue={(val) => updateEvent("submissionUrl", val)}
          label="Event Submission Form URL"
          required={true}
          textArea={false}
        />
        <div className="flex flex-col">
          <label className="">
            Event Genre <span className="text-red-500">*</span>
          </label>
          <div className="w-full border border-black px-4 py-2 rounded-md">
            <DropDown
              options={[
                { id: "Technicals", name: "Technicals" },
                { id: "Culturals", name: "Culturals" },
                { id: "Sports", name: "Sports" },
              ]}
              selectedOption={event.genre}
              changeOption={(option) => updateEvent("genre", option)}
            />
          </div>
        </div>
      </Section>
      <Section customStyles="mt-8">
        <p className="text-lg">Prizes</p>
        {event.prizes.map((prize, idx) => (
          <Input
            key={prize.id}
            placeholder={`Enter Prize for #${prize.position}`}
            value={prize.prize}
            changeValue={(e: string) => updatePrize(idx, e)}
            required={false}
            label={`Enter Prize for #${prize.position}`}
            textArea={false}
          />
        ))}
      </Section>
      <Section customStyles="mt-8">
        <p className="text-lg">Rules</p>
        {event.rules.map((rule, idx) => (
          <Input
            key={idx}
            placeholder={`Enter the Rule`}
            value={rule}
            changeValue={(e: string) => updateRule(idx, e)}
            required={false}
            label={`Rule #${idx + 1}`}
            textArea={false}
          />
        ))}
        <button
          onClick={() =>
            setEvent((event) => ({ ...event, ["rules"]: [...event.rules, ""] }))
          }
          className="w-fit px-5 py-2 rounded-md bg-black text-white cursor-pointer"
        >
          Add Rule
        </button>
      </Section>
      <Section customStyles="mt-8">
        <p className="text-lg">Rounds</p>
        {event.rounds.map((round, idx) => (
          <RoundField
            key={round.id}
            round={round}
            idx={idx}
            updateRound={updateRound}
          />
        ))}
        <button
          onClick={() =>
            setEvent((event) => ({
              ...event,
              ["rounds"]: [
                ...event.rounds,
                {
                  id: 0,
                  roundNumber: event.rounds.length + 1,
                  desc: "",
                  startDate: "",
                  endDate: "",
                },
              ],
            }))
          }
          className="w-fit px-5 py-2 rounded-md bg-black text-white cursor-pointer"
        >
          Add Round
        </button>
      </Section>
      <Section customStyles="mt-8">
        <p className="text-lg">FAQs</p>
        {event.FAQs.map((faq, idx) => (
          <FAQField key={faq.id} idx={idx} faq={faq} updateFAQ={updateFAQ} />
        ))}
        <button
          onClick={() =>
            setEvent((event) => ({
              ...event,
              ["FAQs"]: [
                ...event.FAQs,
                {
                  id: "",
                  question: "",
                  answer: "",
                },
              ],
            }))
          }
          className="w-fit px-5 py-2 rounded-md bg-black text-white cursor-pointer"
        >
          Add FAQ
        </button>
      </Section>
      <button
        onClick={(e) => submitEvent(e)}
        type="submit"
        className="cursor-pointer w-full mt-3 md:mt-5 px-5 py-2 rounded-md bg-black text-white font-medium"
      >
        Save
      </button>
    </form>
  );
}
