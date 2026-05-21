"use client";

import { useEffect, useState } from "react";
import Event from "@/interfaces/event";
import { Question } from "@/interfaces/form";

interface FormSection {
  id: string;
  title: string;
  questions: Question[];
}

export default function RegForm({
  event,
  setEvent,
}: {
  event: Event;
  setEvent: (event: Event) => void;
}) {
  const [formTitle, setFormTitle] = useState(event.name);
  const [formDesc, setFormDesc] = useState(event.tagline || "Register to view this show");
  const [isSaved, setIsSaved] = useState(true);
  
  // Preview mode toggle state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // Show temporary "saved" notification
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Tracks which question has its custom type dropdown open (in edit mode)
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Initial sections state with dummy data matching the screenshot
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: "section-1",
      title: "Personal Details",
      questions: [
        {
          id: "q-1",
          formId: "form-1",
          questionText: "Name",
          type: "short",
          required: true,
          order: 0,
        },
        {
          id: "q-2",
          formId: "form-1",
          questionText: "Student Email ID",
          type: "email",
          required: true,
          order: 1,
        },
        {
          id: "q-3",
          formId: "form-1",
          questionText: "Mobile",
          type: "phone",
          required: true,
          order: 2,
        },
      ],
    },
  ]);

  // Sync title and desc when event prop changes
  useEffect(() => {
    if (event) {
      setFormTitle(event.name);
      setFormDesc(event.tagline || "Register to view this show");
    }
  }, [event]);

  // Trigger brief saving state change
  const markAsModified = () => {
    setIsSaved(false);
  };

  const handleSaveForm = () => {
    setIsSaved(true);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      questions: [],
    };
    setSections([...sections, newSection]);
    markAsModified();
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((sec) => sec.id !== sectionId));
    markAsModified();
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(
      sections.map((sec) => (sec.id === sectionId ? { ...sec, title: newTitle } : sec))
    );
    markAsModified();
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      formId: "form-1",
      questionText: "",
      type: "short",
      required: false,
      order: 0,
    };
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          questions: [...sec.questions, newQuestion],
        };
      })
    );
    markAsModified();
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.filter((q) => q.id !== questionId),
        };
      })
    );
    markAsModified();
  };

  const updateQuestionField = (
    sectionId: string,
    questionId: string,
    field: string,
    value: any
  ) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => {
            if (q.id !== questionId) return q;

            let updated = { ...q, [field]: value } as any;

            // Initialize options if converting to options-based types
            if (
              field === "type" &&
              (value === "single-select" || value === "multi-select" || value === "dropdown") &&
              !updated.options
            ) {
              updated.options = [
                { id: `opt-${Date.now()}-1`, questionId, text: "Option 1" },
                { id: `opt-${Date.now()}-2`, questionId, text: "Option 2" },
              ];
            }
            return updated;
          }),
        };
      })
    );
    markAsModified();
  };

  // 12 fields corresponding exactly to the screenshot selection list
  const dropdownOptions = [
    { value: "short", label: "Short Answer", icon: "menu" },
    { value: "paragraph", label: "Paragraph", icon: "notes" },
    { value: "email", label: "Email", icon: "mail" },
    { value: "url", label: "URL", icon: "open_in_new" },
    { value: "phone", label: "Phone", icon: "call" },
    { value: "date-time", label: "Date & Time", icon: "today" },
    { value: "date", label: "Date", icon: "calendar_month" },
    { value: "time", label: "Time", icon: "schedule" },
    { value: "number", label: "Number", icon: "calculate" },
    { value: "single-select", label: "Multiple Choice", icon: "radio_button_checked" },
    { value: "multi-select", label: "Checkbox", icon: "check_box" },
    { value: "dropdown", label: "DropDown", icon: "arrow_drop_down" },
  ];

  const getQuestionTypeIcon = (type: string) => {
    const matched = dropdownOptions.find((opt) => opt.value === type);
    return matched ? matched.icon : "menu";
  };

  const getQuestionTypeLabel = (type: string) => {
    const matched = dropdownOptions.find((opt) => opt.value === type);
    return matched ? matched.label : "Short Answer";
  };

  return (
    <div className="w-full py-2 relative select-none">
      
      {/* Invisible backdrop to dismiss open dropdown menus */}
      {activeDropdownId && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setActiveDropdownId(null)}
        />
      )}

      {/* Floating Save Toast Banner */}
      {showSavedToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 border border-green-500 text-white font-semibold text-xs py-2.5 px-6 rounded-md shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Registration form layout saved successfully!</span>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-5xl">
        
        {/* Top Header Row with Form title, Save, and Preview Buttons */}
        <div className="flex items-center justify-between mt-4 mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">Form</h2>
          
          <div className="flex items-center gap-3">
            {/* Save Button */}
            <button
              onClick={handleSaveForm}
              className="bg-red-600 hover:bg-red-750 text-white font-semibold text-xs py-2 px-4 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              Save Form
            </button>

            {/* Preview Button */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-2 px-4 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPreviewMode ? "edit" : "visibility"}
              </span>
              {isPreviewMode ? "Edit Form" : "Preview"}
            </button>
          </div>
        </div>

        {/* Form Container (changes depending on Preview / Edit state) */}
        {isPreviewMode ? (
          /* ========================================================================= */
          /* FORM PREVIEW MODE (HOW USERS SEE THE RENDERED REGISTRATION FORM)          */
          /* ========================================================================= */
          <div className="bg-[#030303] text-zinc-100 p-6 md:p-8 rounded-xl border border-zinc-900 shadow-2xl flex flex-col gap-6 w-full">
            
            {/* Preview Header Banner */}
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 rounded-md py-2.5 px-4 mb-2 text-zinc-300 text-xs">
              <span className="material-symbols-outlined text-[16px] text-yellow-500">info</span>
              <span>You are viewing a preview of the registration form. Fill in fields below to test layout and validation.</span>
            </div>

            {/* Form Title & Description */}
            <div className="flex flex-col gap-3 pb-6 border-b border-zinc-900">
              <h1 className="text-3xl font-extrabold uppercase tracking-wide text-white">{formTitle || "Untitled Event"}</h1>
              <p className="text-sm text-zinc-300 font-sans leading-relaxed">{formDesc || "Register to view this show"}</p>
            </div>

            {/* Render Sections */}
            <div className="flex flex-col gap-6 mt-2">
              {sections.length === 0 ? (
                <div className="text-zinc-500 text-sm py-12 text-center">
                  This form has no fields defined. Go back to Edit Mode to add sections and questions.
                </div>
              ) : (
                sections.map((section) => (
                  <div key={section.id} className="flex flex-col gap-4 border border-zinc-900 rounded-lg p-5 md:p-6 bg-[#060606]">
                    
                    {/* Section Header */}
                    <div className="pb-2.5 border-b border-zinc-900">
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">{section.title}</h3>
                    </div>

                    {/* Section Fields */}
                    <div className="flex flex-col gap-4">
                      {section.questions.length === 0 ? (
                        <p className="text-xs text-zinc-500 italic">No fields in this section.</p>
                      ) : (
                        section.questions.map((question) => (
                          <div key={question.id} className="flex flex-col gap-2">
                            {/* Question Label */}
                            <label className="text-xs font-semibold text-zinc-200">
                              {question.questionText || "Untitled Question"}
                              {question.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                            </label>

                            {/* Render Interactive Field */}
                            <div className="w-full">
                              {question.type === "paragraph" ? (
                                <textarea
                                  placeholder="Your answer"
                                  className="w-full h-24 bg-[#0a0a0a] border border-zinc-800 rounded-md px-3.5 py-2.5 text-sm text-zinc-150 placeholder-zinc-700 focus:border-zinc-550 focus:outline-none transition-colors resize-none font-medium"
                                />
                              ) : question.type === "single-select" ? (
                                <div className="flex flex-col gap-2.5 mt-1">
                                  {(question as any).options?.map((opt: any) => (
                                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer group w-fit">
                                      <input
                                        type="radio"
                                        name={question.id}
                                        className="accent-red-600 h-4 w-4 bg-[#0a0a0a] border-zinc-800"
                                      />
                                      <span className="text-xs text-zinc-300 group-hover:text-white transition-colors font-medium">
                                        {opt.text}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              ) : question.type === "multi-select" ? (
                                <div className="flex flex-col gap-2.5 mt-1">
                                  {(question as any).options?.map((opt: any) => (
                                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer group w-fit">
                                      <input
                                        type="checkbox"
                                        className="accent-red-600 h-4 w-4 bg-[#0a0a0a] border-zinc-800 rounded"
                                      />
                                      <span className="text-xs text-zinc-300 group-hover:text-white transition-colors font-medium">
                                        {opt.text}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              ) : question.type === "dropdown" ? (
                                <select className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-md px-3.5 py-2.5 text-xs text-zinc-150 focus:border-zinc-550 focus:outline-none transition-colors font-medium cursor-pointer">
                                  <option value="" disabled selected>Select an option</option>
                                  {(question as any).options?.map((opt: any) => (
                                    <option key={opt.id} value={opt.id} className="bg-[#080808]">
                                      {opt.text}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={
                                    question.type === "email"
                                      ? "email"
                                      : question.type === "phone"
                                      ? "tel"
                                      : question.type === "url"
                                      ? "url"
                                      : question.type === "number"
                                      ? "number"
                                      : question.type === "date"
                                      ? "date"
                                      : question.type === "time"
                                      ? "time"
                                      : question.type === "date-time"
                                      ? "datetime-local"
                                      : "text"
                                  }
                                  placeholder={
                                    question.type === "email"
                                      ? "e.g. student@example.com"
                                      : question.type === "phone"
                                      ? "e.g. +91 98765 43210"
                                      : question.type === "url"
                                      ? "e.g. https://github.com"
                                      : question.type === "number"
                                      ? "Enter number value"
                                      : question.type === "date"
                                      ? "Select date"
                                      : question.type === "time"
                                      ? "Select time"
                                      : question.type === "date-time"
                                      ? "Select date and time"
                                      : "Enter short answer"
                                  }
                                  className="w-full h-10 bg-[#0a0a0a] border border-zinc-800 rounded-md px-3.5 text-xs text-zinc-150 placeholder-zinc-700 focus:border-zinc-550 focus:outline-none transition-colors font-medium"
                                />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Test Submit Button */}
            <button
              onClick={() => alert("Form submission simulated! Layout is fully responsive.")}
              className="mt-4 bg-red-600 hover:bg-red-750 text-white font-semibold text-xs py-2.5 px-6 rounded-md transition-colors shadow-md self-end cursor-pointer"
            >
              Submit Registration
            </button>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORM EDITOR MODE (ORIGINAL BUILDER VIEW)                                  */
          /* ========================================================================= */
          <div className="bg-[#030303] text-zinc-100 p-5 md:p-6 rounded-xl border border-zinc-900 shadow-2xl flex flex-col gap-5 w-full">
            
            {/* Header Settings Section */}
            <div className="flex flex-col gap-2 border-b border-zinc-900 pb-5 relative">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    markAsModified();
                  }}
                  className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider bg-transparent text-white border-b border-transparent focus:border-zinc-850 outline-none w-full py-1 font-sans"
                  placeholder="Event Title"
                />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c0c0c] border border-zinc-850">
                  <span className={`h-2 w-2 rounded-full ${isSaved ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-spin"}`}></span>
                  <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
                    {isSaved ? "Saved" : "Modified"}
                  </span>
                </div>
              </div>

              <div className="mt-1 bg-[#0c0c0c] border border-zinc-900 rounded-md py-2.5 px-4 flex items-center">
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => {
                    setFormDesc(e.target.value);
                    markAsModified();
                  }}
                  className="bg-transparent text-zinc-200 text-sm font-sans outline-none w-full placeholder-zinc-500 font-medium"
                  placeholder="Form Description"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end items-center">
              <button
                onClick={addSection}
                className="bg-white text-black font-semibold text-xs py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors shadow-md flex items-center gap-1 cursor-pointer"
              >
                Add Section
              </button>
            </div>

            {/* Form Sections list */}
            <div className="flex flex-col gap-6">
              {sections.map((section) => (
                <div key={section.id} className="flex flex-col gap-3.5">
                  
                  {/* Section Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-red-500/80 rounded-md bg-black px-3 py-1">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        className="bg-transparent text-white text-xs font-bold uppercase tracking-wider outline-none w-auto max-w-[180px] placeholder-zinc-400"
                        placeholder="Section Title"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addQuestion(section.id)}
                        className="border border-zinc-800 rounded-md p-1.5 bg-[#0c0c0c] text-zinc-200 hover:text-white hover:border-zinc-650 transition-colors flex items-center justify-center cursor-pointer"
                        title="Add Question"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="border border-red-950 rounded-md p-1.5 bg-[#0c0c0c] text-red-400 hover:text-red-500 hover:border-red-800 transition-colors flex items-center justify-center cursor-pointer"
                        title="Delete Section"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Content Box */}
                  <div className="border border-zinc-900 rounded-lg p-4 md:p-5 flex flex-col gap-5 bg-[#060606]">
                    {section.questions.length === 0 ? (
                      <div className="text-zinc-400 text-xs py-8 text-center flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[24px] text-zinc-500">quiz</span>
                        <p className="font-medium">No fields in this section yet. Click the + button above to add one.</p>
                      </div>
                    ) : (
                      section.questions.map((question) => (
                        <div
                          key={question.id}
                          className={`border-b border-zinc-900/50 pb-5 last:border-b-0 last:pb-0 flex flex-col gap-2.5 relative ${
                            activeDropdownId === question.id ? "z-50" : "z-10"
                          }`}
                        >
                          {/* Question Line */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Label Input */}
                            <div className="flex-1">
                              <input
                                type="text"
                                value={question.questionText}
                                onChange={(e) =>
                                  updateQuestionField(section.id, question.id, "questionText", e.target.value)
                                }
                                className="bg-transparent border-b border-zinc-850 focus:border-zinc-500 text-white font-semibold outline-none py-1 w-full text-sm placeholder-zinc-500"
                                placeholder="Enter question/field label"
                              />
                            </div>

                            {/* Custom Dropdown Type Select */}
                            <div className="relative w-full md:w-[190px] z-40">
                              <button
                                type="button"
                                onClick={() => setActiveDropdownId(activeDropdownId === question.id ? null : question.id)}
                                className="w-full flex items-center justify-between bg-[#0c0c0c] border border-zinc-850 rounded-md px-3 py-2 text-xs text-white font-semibold cursor-pointer hover:border-zinc-700 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="material-symbols-outlined text-[16px] text-zinc-400">
                                    {getQuestionTypeIcon(question.type)}
                                  </span>
                                  <span>{getQuestionTypeLabel(question.type)}</span>
                                </div>
                                <span className="material-symbols-outlined text-[16px] text-zinc-400">
                                  {activeDropdownId === question.id ? "arrow_drop_up" : "arrow_drop_down"}
                                </span>
                              </button>

                              {activeDropdownId === question.id && (
                                <div className="absolute right-0 mt-1 w-full bg-black border border-zinc-900 rounded-md shadow-2xl py-1 z-50 overflow-hidden max-h-[300px] overflow-y-auto">
                                  {dropdownOptions.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        updateQuestionField(section.id, question.id, "type", opt.value);
                                        setActiveDropdownId(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors bg-black text-zinc-300 hover:text-white hover:bg-zinc-900/60"
                                    >
                                      <span className="material-symbols-outlined text-[16px] text-zinc-400">
                                        {opt.icon}
                                      </span>
                                      <span>{opt.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Input Area Preview (in editor mode) */}
                          <div className="w-full">
                            {question.type === "paragraph" ? (
                              <textarea
                                disabled
                                placeholder="Long answer text placeholder"
                                className="resize-none overflow-hidden h-16 w-full bg-[#030303] border border-[#161616] rounded-md px-4 py-2.5 text-zinc-400 placeholder-zinc-700 text-xs outline-none cursor-not-allowed font-medium"
                              />
                            ) : question.type === "single-select" || question.type === "multi-select" || question.type === "dropdown" ? (
                              /* Options Config Block */
                              <div className="flex flex-col gap-2 mt-1 pl-4 border-l border-zinc-855">
                                {(question as any).options?.map((opt: any, optIdx: number) => (
                                  <div key={opt.id} className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px] text-zinc-500">
                                      {question.type === "single-select"
                                        ? "radio_button_unchecked"
                                        : question.type === "dropdown"
                                        ? "arrow_drop_down_circle"
                                        : "check_box_outline_blank"}
                                    </span>
                                    <input
                                      type="text"
                                      value={opt.text}
                                      onChange={(e) => {
                                        const updatedOpts = (question as any).options.map((o: any) =>
                                          o.id === opt.id ? { ...o, text: e.target.value } : o
                                        );
                                        updateQuestionField(section.id, question.id, "options", updatedOpts);
                                      }}
                                      className="bg-transparent text-xs text-zinc-200 border-b border-transparent focus:border-zinc-800 outline-none py-0.5 flex-1 placeholder-zinc-650 font-medium"
                                      placeholder={`Option ${optIdx + 1}`}
                                    />
                                    <button
                                      onClick={() => {
                                        const updatedOpts = (question as any).options.filter((o: any) => o.id !== opt.id);
                                        updateQuestionField(section.id, question.id, "options", updatedOpts);
                                      }}
                                      className="text-zinc-500 hover:text-red-500 transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const newOpt = {
                                      id: `opt-${Date.now()}`,
                                      questionId: question.id,
                                      text: `Option ${(question as any).options?.length + 1 || 1}`,
                                    };
                                    const updatedOpts = [...((question as any).options || []), newOpt];
                                    updateQuestionField(section.id, question.id, "options", updatedOpts);
                                  }}
                                  className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 self-start mt-0.5 cursor-pointer font-semibold"
                                >
                                  <span className="material-symbols-outlined text-[12px]">add</span> Add Option
                                </button>
                              </div>
                            ) : (
                              <input
                                type="text"
                                disabled
                                placeholder={
                                  question.type === "email"
                                    ? "student@example.com"
                                    : question.type === "phone"
                                    ? "+91 99999 99999"
                                    : question.type === "url"
                                    ? "https://example.com"
                                    : question.type === "date"
                                    ? "YYYY-MM-DD (Date)"
                                    : question.type === "time"
                                    ? "HH:MM (Time)"
                                    : question.type === "date-time"
                                    ? "YYYY-MM-DD HH:MM (Date & Time)"
                                    : question.type === "number"
                                    ? "Numeric input placeholder"
                                    : "Short answer text placeholder"
                                }
                                className="w-full h-9 bg-[#030303] border border-[#161616] rounded-md px-4 text-zinc-350 placeholder-zinc-700 text-[11px] outline-none cursor-not-allowed font-medium"
                              />
                            )}
                          </div>

                          {/* Controls (Required / Delete Question) */}
                          <div className="flex justify-end items-center gap-3.5 mt-0.5">
                            <button
                              onClick={() => deleteQuestion(section.id, question.id)}
                              className="text-zinc-500 hover:text-red-500 transition-colors flex items-center justify-center cursor-pointer"
                              title="Delete Field"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>

                            <div className="h-4 w-[1px] bg-zinc-900" />

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-200 font-semibold select-none">Required</span>
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) =>
                                    updateQuestionField(section.id, question.id, "required", e.target.checked)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4.5 bg-zinc-800 rounded-full peer peer-checked:bg-white transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-500 peer-checked:after:bg-black after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
