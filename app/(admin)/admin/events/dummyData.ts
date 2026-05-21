import Event from "@/interfaces/event";
import Profile from "@/interfaces/profile";

export const mockProfile = (name: string): Profile => ({
  name,
  email: `${name.toLowerCase().replace(/\s+/g, "")}@example.com`,
  level: "Foundation", // adjust based on your enum
  program: "Data Science", // adjust based on your enum
  mobile: 9876543210,
  state: "Punjab",
  academic_status: "Standalone",
  points: 0,
  pos: "Student", // adjust based on your type
  perms: [],
});

export const events: Event[] = [
  {
    id: "event-chromatix",
    name: "CHROMATIX",
    genre: "Culturals",
    finalLevelApproved: "pending",
    firstLevelApproved: "pending",
    createdBy: mockProfile("Admin"),
    eventTeam: [],
    createdOn: "2026-05-21",
    rules: ["Submit original artwork/designs", "Individual participation only"],
    desc: "A vibrant visual art and design display.",
    tagline: "Register to view this show",
    poster: "https://picsum.photos/seed/chromatix/400/200",
    submissionURL: "https://submission.example.com/chromatix",
    prizes: [
      { id: "prize-c1", position: 1, prize: "$500" },
      { id: "prize-c2", position: 2, prize: "$250" },
      { id: "prize-c3", position: "Participant", prize: "E-Certificate" }
    ],
    rounds: [
      {
        id: "round-c1",
        roundNumber: 1,
        desc: "Design Round",
        startDate: "2026-05-25",
        endDate: "2026-05-28"
      }
    ],
    FAQs: [
      {
        id: "faq-c1",
        question: "Is there any theme?",
        answer: "The theme will be announced on the start date."
      }
    ]
  },
  {
    id: "event-1",
    name: "Hackathon 2026",
    genre: "Technicals",
    finalLevelApproved: [true, mockProfile("Alice")],
    firstLevelApproved: [true, mockProfile("Bob")],
    createdBy: mockProfile("Charlie"),
    eventTeam: [mockProfile("Alice"), mockProfile("Bob")],
    createdOn: "2026-03-01",
    rules: ["No plagiarism", "Teams of max 4", "Submit before deadline"],
    desc: "A 24-hour coding competition to build innovative solutions.",
    FAQs: [
      {
        id: "faq-1",
        question: "Who can participate?",
        answer: "Anyone with basic coding knowledge.",
      },
      {
        id: "faq-2",
        question: "Is it online?",
        answer: "Yes, fully online.",
      },
    ],
    rounds: [
      {
        id: "round-1",
        roundNumber: 1,
        desc: "Idea submission",
        startDate: "2026-03-05",
        endDate: "2026-03-07",
      },
      {
        id: "round-2",
        roundNumber: 2,
        desc: "Final implementation",
        startDate: "2026-03-10",
        endDate: "2026-03-12",
      },
    ],
    prizes: [
      { id: "prize-1", position: 1, prize: "$1000" },
      { id: "prize-2", position: 2, prize: "$500" },
      { id: "prize-3", position: 3, prize: "$250" },
      { id: "prize-4", position: "Participant", prize: "Certificate" },
    ],
    poster: "https://picsum.photos/seed/hackathon/400/200",
    tagline: "Code. Build. Win.",
    submissionURL: "https://example.com/hackathon-submit",
  },

  {
    id: "event-2",
    name: "UI/UX Design Challenge",
    genre: "Sports",
    finalLevelApproved: [false, mockProfile("George")],
    firstLevelApproved: [true, mockProfile("David")],
    createdBy: mockProfile("Eva"),
    eventTeam: [mockProfile("David"), mockProfile("Fiona")],
    createdOn: "2026-02-15",
    rules: ["Original designs only", "Submit Figma link"],
    desc: "Design intuitive and visually appealing user interfaces.",
    FAQs: [
      {
        id: "faq-3",
        question: "Which tools are allowed?",
        answer: "Figma, Adobe XD, Sketch.",
      },
    ],
    rounds: [
      {
        id: "round-3",
        roundNumber: 1,
        desc: "Wireframing",
        startDate: "2026-02-20",
        endDate: "2026-02-22",
      },
      {
        id: "round-4",
        roundNumber: 2,
        desc: "High-fidelity design",
        startDate: "2026-02-25",
        endDate: "2026-02-28",
      },
    ],
    prizes: [
      { id: "prize-5", position: 1, prize: "$500" },
      { id: "prize-6", position: 2, prize: "$300" },
      { id: "prize-7", position: "Participant", prize: "Goodies" },
    ],
    poster: "https://picsum.photos/seed/design/400/200",
    tagline: "Design that speaks.",
    submissionURL: "https://example.com/design-submit",
  },

  {
    id: "event-3",
    name: "AI Quiz Bowl",
    genre: "Culturals",
    finalLevelApproved: "pending",
    firstLevelApproved: "pending",
    createdBy: mockProfile("George"),
    eventTeam: [mockProfile("Hannah")],
    createdOn: "2026-04-01",
    rules: ["No cheating", "Individual participation only"],
    desc: "Test your knowledge in Artificial Intelligence and ML.",
    FAQs: [
      {
        id: "faq-4",
        question: "Is prior AI knowledge required?",
        answer: "Basic understanding is recommended.",
      },
    ],
    rounds: [
      {
        id: "round-5",
        roundNumber: 1,
        desc: "MCQ Round",
        startDate: "2026-04-05",
        endDate: "2026-04-05",
      },
      {
        id: "round-6",
        roundNumber: 2,
        desc: "Rapid fire",
        startDate: "2026-04-06",
        endDate: "2026-04-06",
      },
    ],
    prizes: [
      { id: "prize-8", position: 1, prize: "$300" },
      { id: "prize-9", position: 2, prize: "$150" },
      { id: "prize-10", position: "Participant", prize: "E-Certificate" },
    ],
    poster: "https://picsum.photos/seed/ai/400/200",
    submissionURL: "https://example.com/ai-submit",
  },
];
