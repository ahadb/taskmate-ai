import { CreateTaskRequest, ParsedTaskData } from "../types/index.js";

// Simple NLP patterns for task parsing
const DATE_PATTERNS = [
  /(?:today|tonight)/i,
  /(?:tomorrow|tmr)/i,
  /(?:next week|next monday|next tuesday|next wednesday|next thursday|next friday|next saturday|next sunday)/i,
  /(?:this weekend|this saturday|this sunday)/i,
  /(?:in \d+ days?)/i,
  /(?:on \w+ \d+)/i,
  /(?:by \w+ \d+)/i,
];

const PRIORITY_PATTERNS = [
  {
    pattern: /(?:urgent|asap|immediately|high priority)/i,
    priority: "high" as const,
  },
  { pattern: /(?:important|medium priority)/i, priority: "medium" as const },
  { pattern: /(?:low priority|not urgent)/i, priority: "low" as const },
];

const TIME_PATTERNS = [
  /(?:at \d{1,2}(?::\d{2})?(?:am|pm)?)/i,
  /(?:by \d{1,2}(?::\d{2})?(?:am|pm)?)/i,
  /(?:before \d{1,2}(?::\d{2})?(?:am|pm)?)/i,
];

export const parseNaturalLanguageTask = (input: string): CreateTaskRequest => {
  const lowerInput = input.toLowerCase();

  // Extract title (first sentence or first 50 characters)
  let title = input.split(/[.!?]/)[0]?.trim() || input;
  if (title.length > 50) {
    title = title.substring(0, 50) + "...";
  }

  // Use full input as description
  const description = input;

  // Extract due date
  let due_date: string | undefined;
  for (const pattern of DATE_PATTERNS) {
    const match = lowerInput.match(pattern);
    if (match) {
      due_date = parseDateFromText(match[0]);
      break;
    }
  }

  // Extract priority
  let priority: "low" | "medium" | "high" | undefined;
  for (const { pattern, priority: priorityValue } of PRIORITY_PATTERNS) {
    if (pattern.test(lowerInput)) {
      priority = priorityValue;
      break;
    }
  }

  const result: CreateTaskRequest = {
    title,
    description,
  };

  if (due_date) {
    result.due_date = due_date;
  }

  if (priority) {
    result.priority = priority;
  }

  return result;
};

const parseDateFromText = (dateText: string): string => {
  const today = new Date();
  const lowerText = dateText.toLowerCase();

  if (lowerText.includes("today") || lowerText.includes("tonight")) {
    return today.toISOString().split("T")[0] || "";
  }

  if (lowerText.includes("tomorrow") || lowerText.includes("tmr")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0] || "";
  }

  if (lowerText.includes("next week")) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split("T")[0] || "";
  }

  if (lowerText.includes("this weekend")) {
    const saturday = new Date(today);
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    saturday.setDate(saturday.getDate() + daysUntilSaturday);
    return saturday.toISOString().split("T")[0] || "";
  }

  // Extract number of days
  const daysMatch = lowerText.match(/in (\d+) days?/);
  if (daysMatch && daysMatch[1]) {
    const days = parseInt(daysMatch[1]);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString().split("T")[0] || "";
  }

  // Default to tomorrow if no specific date found
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0] || "";
};

// Enhanced parsing for more complex inputs
export const parseComplexTask = (input: string): ParsedTaskData => {
  const basicTask = parseNaturalLanguageTask(input);

  // Extract time information
  const timeMatch = input.match(
    /(?:at|by|before) (\d{1,2}(?::\d{2})?(?:am|pm)?)/i
  );
  let timeInfo = "";
  if (timeMatch) {
    timeInfo = ` at ${timeMatch[1]}`;
  }

  // Enhance title with time if found
  const enhancedTitle = timeInfo
    ? `${basicTask.title}${timeInfo}`
    : basicTask.title;

  return {
    ...basicTask,
    title: enhancedTitle,
  };
};
