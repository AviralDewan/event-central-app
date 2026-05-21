"use client";

import Event from "@/interfaces/event";
import Input from "../../components/Events/Input";
import Form, { Question } from "@/interfaces/form";
import { useState } from "react";
import { mockProfile } from "../dummyData";
import DropDown from "../../components/Events/DropDown";

export default function RegForm({
  event,
  setEvent,
}: {
  event: Event;
  setEvent: (event: Event) => void;
}) {
  const user = mockProfile("Your guy");

  const [form, setForm] = useState<Form>({
    id: "id",
    eventId: "0",
    title: "",
    desc: "",
    createdBy: user,
    createdOn: "2026-04-22",
  });

  const [questions, setQuestions] = useState<Question>([]);

  const updateForm = (property: string, val: string) => {
    setForm((form) => ({ ...form, [property]: val }));
  };

  return (
    <div className="p-3 w-full flex flex-col justify-center items-center">
      <p className="mt-4 md:mt-8 text-xl">Registration Form Builder</p>
      <div className="mt-5 w-full md:w-[80%] flex flex-col gap-y-5">
        <Input
          placeholder="Enter Form Title"
          changeValue={(val: string) => updateForm("title", val)}
          value={form.title}
          required={true}
          label="Form Title"
          textArea={false}
        />
        <Input
          placeholder="Enter Form Description"
          changeValue={(val: string) => updateForm("desc", val)}
          value={form.desc}
          required={false}
          label="Form Description"
          textArea={true}
        />
      </div>
      <div className="mt-5 w-full md:w-[80%]">
        <div className="flex flex-col md:flex-row gap-5 md:gap-10">
          <p className="">Select question type to ADD a new question</p>
          <DropDown />
        </div>
      </div>
    </div>
  );
}
