import OpenAI from "openai";
import { CreateTaskRequest } from "../types/index.js";
import { log } from "console";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

log(openai);

export interface AITaskParseResult {
  title: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  confidence: number;
  reasoning?: string;
}

export const parseTaskWithAI = async (
  input: string
): Promise<CreateTaskRequest> => {
  try {
    const systemPrompt = `You are an intelligent task parser. Parse the user's natural language input and extract task information.

Return a JSON object with the following structure:
{
  "title": "A concise, clear task title (max 100 characters)",
  "description": "Detailed description or the original input if no specific description",
  "due_date": "ISO date string (YYYY-MM-DD) or null if no date mentioned",
  "priority": "low, medium, high, or null based on urgency indicators",
  "confidence": "number between 0-1 indicating confidence in the parsing",
  "reasoning": "brief explanation of how you parsed the input"
}

Guidelines:
- Extract dates from phrases like "tomorrow", "next week", "by Friday", "in 3 days"
- Identify priority from words like "urgent", "asap", "important", "low priority"
- If no specific date is mentioned, set due_date to null
- If no priority indicators, set priority to null
- Be conservative with date parsing - only extract clear date references
- Consider context and common task patterns

Example inputs and outputs:
Input: "Call dentist tomorrow at 3pm urgent"
Output: {"title": "Call dentist", "description": "Call dentist tomorrow at 3pm urgent", "due_date": "2024-12-21", "priority": "high", "confidence": 0.95, "reasoning": "Extracted 'tomorrow' as date, 'urgent' as high priority"}

Input: "Buy groceries this weekend"
Output: {"title": "Buy groceries", "description": "Buy groceries this weekend", "due_date": "2024-12-21", "priority": null, "confidence": 0.9, "reasoning": "Extracted 'this weekend' as date, no priority indicators"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent parsing
      max_tokens: 500,
    });

    const result = JSON.parse(
      response.choices[0]?.message?.content || "{}"
    ) as AITaskParseResult;

    // Convert to CreateTaskRequest format
    const taskRequest: CreateTaskRequest = {
      title: result.title,
      ...(result.description && { description: result.description }),
      ...(result.due_date && { due_date: result.due_date }),
      ...(result.priority && { priority: result.priority }),
    };

    return taskRequest;
  } catch (error) {
    console.error("AI parsing error:", error);

    // Fallback to basic parsing if AI fails
    return {
      title: input.split(/[.!?]/)[0]?.trim() || input,
      description: input,
    };
  }
};

export const enhanceTaskWithAI = async (
  taskData: CreateTaskRequest
): Promise<CreateTaskRequest> => {
  try {
    const systemPrompt = `You are a task enhancement AI. Given a basic task, suggest improvements to make it more actionable and complete.

Consider:
- Adding missing context or details
- Suggesting appropriate priority if none set
- Recommending due dates if none specified
- Making titles more specific and actionable

Return a JSON object with enhanced task data:
{
  "title": "Enhanced title",
  "description": "Enhanced description", 
  "due_date": "Suggested due date or existing one",
  "priority": "Suggested priority or existing one",
  "enhancements": ["list of improvements made"]
}`;

    const inputText = `Title: ${taskData.title}
Description: ${taskData.description || "No description"}
Due Date: ${taskData.due_date || "No due date"}
Priority: ${taskData.priority || "No priority"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: inputText },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const enhanced = JSON.parse(response.choices[0]?.message?.content || "{}");

    return {
      title: enhanced.title || taskData.title,
      description: enhanced.description || taskData.description,
      due_date: enhanced.due_date || taskData.due_date,
      priority: enhanced.priority || taskData.priority,
    };
  } catch (error) {
    console.error("AI enhancement error:", error);
    return taskData; // Return original if enhancement fails
  }
};

export const suggestTaskImprovements = async (
  taskData: CreateTaskRequest
): Promise<string[]> => {
  try {
    const systemPrompt = `Analyze this task and suggest 2-3 specific improvements to make it more actionable and effective.

Focus on:
- Specificity and clarity
- Missing information
- Better prioritization
- Time management
- Actionability

Return a JSON array of improvement suggestions:
["suggestion 1", "suggestion 2", "suggestion 3"]`;

    const inputText = `Task: ${taskData.title}
Description: ${taskData.description || "No description"}
Due Date: ${taskData.due_date || "No due date"}
Priority: ${taskData.priority || "No priority"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: inputText },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return result.suggestions || [];
  } catch (error) {
    console.error("AI suggestion error:", error);
    return [];
  }
};
