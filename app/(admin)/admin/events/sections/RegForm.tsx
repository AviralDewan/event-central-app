"use client";

import { useState } from "react";
import Event from "@/interfaces/event";
import Form, { Question, QuestionType, Section } from "@/interfaces/form";

const QUESTION_TYPES: QuestionType[] = [
  "short",
  "long",
  "checkbox",
  "dropdown",
  "radio",
  "email",
  "number",
  "date",
];

export default function RegForm({ event }: { event?: Event }) {
  const [form, setForm] = useState<Form>({
    id: crypto.randomUUID(),
    eventId: event?.id ?? "",
    title: "",
    desc: "",
    createdBy: {},
    createdOn: new Date().toISOString(),
    sections: [],
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Event...
      </div>
    );
  }

  const updateForm = (key: keyof Form, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addSection = () => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: `Section ${form.sections.length + 1}`,
      questions: [],
    };

    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (sectionId: string, key: keyof Section, value: any) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, [key]: value } : section
      ),
    }));
  };

  const addQuestion = (sectionId: string, type: QuestionType = "short") => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      question: "",
      type,
      required: false,
      options:
        type === "checkbox" || type === "dropdown" || type === "radio"
          ? ["Option 1"]
          : undefined,
    };

    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [...section.questions, newQuestion],
            }
          : section
      ),
    }));
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    key: keyof Question,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                [key]: value,
              }
            : q
        ),
      })),
    }));
  };

  const addOption = (sectionId: string, questionId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) => {
          if (q.id !== questionId) return q;

          return {
            ...q,
            options: [
              ...(q.options || []),
              `Option ${(q.options?.length || 0) + 1}`,
            ],
          };
        }),
      })),
    }));
  };

  const validateForm = () => {
    const validationErrors: string[] = [];

    if (!form.title.trim()) {
      validationErrors.push("Form title is required.");
    }

    if (form.sections.length === 0) {
      validationErrors.push("At least one section is required.");
    }

    form.sections.forEach((section, sectionIndex) => {
      if (!section.title.trim()) {
        validationErrors.push(`Section ${sectionIndex + 1} must have a title.`);
      }

      if (section.questions.length === 0) {
        validationErrors.push(
          `Section ${sectionIndex + 1} must contain at least one question.`
        );
      }

      section.questions.forEach((question, questionIndex) => {
        if (!question.question.trim()) {
          validationErrors.push(
            `Question ${questionIndex + 1} in Section ${
              sectionIndex + 1
            } is empty.`
          );
        }

        const requiresOptions =
          question.type === "checkbox" ||
          question.type === "dropdown" ||
          question.type === "radio";

        if (requiresOptions) {
          if (!question.options || question.options.length < 1) {
            validationErrors.push(
              `Question "${question.question}" needs at least one option.`
            );
          }

          const emptyOption = question.options?.some(
            (option) => !option.trim()
          );

          if (emptyOption) {
            validationErrors.push(
              `Question "${question.question}" has an empty option.`
            );
          }
        }
      });
    });

    return validationErrors;
  };

  const handleSaveForm = async () => {
    setErrors([]);
    setSuccessMessage("");

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSaving(true);

      // fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("FORM PAYLOAD", form);

      setSuccessMessage("Form saved successfully.");
    } catch (error) {
      setErrors(["Something went wrong while saving the form."]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Form Header */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
          <input
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)}
            placeholder="Form Title"
            className="w-full text-3xl font-semibold outline-none"
          />

          <textarea
            value={form.desc}
            onChange={(e) => updateForm("desc", e.target.value)}
            placeholder="Form Description"
            className="w-full mt-4 resize-none outline-none text-zinc-600"
          />
        </div>

        {/* Sections */}
        {form.sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm"
          >
            {/* Section Header */}
            <div className="mb-6">
              <input
                value={section.title}
                onChange={(e) =>
                  updateSection(section.id, "title", e.target.value)
                }
                placeholder="Section Title"
                className="w-full text-2xl font-semibold outline-none"
              />
            </div>

            {/* Questions */}
            <div className="space-y-5">
              {section.questions.map((question) => (
                <div
                  key={question.id}
                  className="border border-zinc-200 rounded-xl p-4"
                >
                  <div className="flex gap-4 items-start">
                    <input
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(
                          section.id,
                          question.id,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="Question"
                      className="flex-1 border-b border-zinc-300 outline-none py-2"
                    />

                    <select
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(
                          section.id,
                          question.id,
                          "type",
                          e.target.value
                        )
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      {QUESTION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preview */}
                  <div className="mt-4">
                    {question.type === "short" && (
                      <input
                        disabled
                        placeholder="Short answer text"
                        className="w-full border-b outline-none py-2"
                      />
                    )}

                    {question.type === "long" && (
                      <textarea
                        disabled
                        placeholder="Long answer text"
                        className="w-full border rounded-lg p-3"
                      />
                    )}

                    {(question.type === "checkbox" ||
                      question.type === "dropdown" ||
                      question.type === "radio") && (
                      <div className="space-y-2">
                        {question.options?.map((option, idx) => (
                          <input
                            key={idx}
                            value={option}
                            onChange={(e) => {
                              const updated = question.options?.map((o, i) =>
                                i === idx ? e.target.value : o
                              );

                              updateQuestion(
                                section.id,
                                question.id,
                                "options",
                                updated
                              );
                            }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        ))}

                        <button
                          onClick={() => addOption(section.id, question.id)}
                          className="text-sm text-blue-600"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    {question.type === "date" && (
                      <input
                        disabled
                        type="date"
                        className="border rounded-lg px-3 py-2"
                      />
                    )}

                    {question.type === "email" && (
                      <input
                        disabled
                        type="email"
                        placeholder="Email"
                        className="w-full border-b outline-none py-2"
                      />
                    )}

                    {question.type === "number" && (
                      <input
                        disabled
                        type="number"
                        placeholder="Number"
                        className="w-full border-b outline-none py-2"
                      />
                    )}
                  </div>

                  {/* Required */}
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) =>
                        updateQuestion(
                          section.id,
                          question.id,
                          "required",
                          e.target.checked
                        )
                      }
                    />

                    <span className="text-sm text-zinc-600">Required</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question */}
            <button
              onClick={() => addQuestion(section.id)}
              className="mt-6 px-4 py-2 rounded-lg bg-black text-white"
            >
              + Add Question
            </button>
          </div>
        ))}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="text-red-700 font-medium mb-2">
              Please fix the following:
            </h3>

            <ul className="list-disc ml-5 space-y-1 text-sm text-red-600">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex gap-4">
          <button
            onClick={addSection}
            className="px-5 py-3 rounded-xl bg-zinc-800 text-white"
          >
            + Add Section
          </button>

          <button
            className="px-5 py-3 rounded-xl bg-black text-white disabled:opacity-50"
            onClick={handleSaveForm}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Form"}
          </button>
        </div>
      </div>
    </div>
  );
}
