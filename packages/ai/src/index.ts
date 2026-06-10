import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { env } from "./env";
import * as prompts from "./prompts";

// The OpenAI provider automatically picks up OPENAI_API_KEY from process.env,
// but we validate it in env.ts to ensure it's present at startup.

/**
 * Summarizes the given email.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body content of the email.
 * @param {string} from - The sender of the email.
 * @returns {Promise<string>} A 1-line string summary.
 */
export async function summarizeEmail(subject: string, body: string, from: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4.1"),
    system: prompts.SUMMARIZE_PROMPT,
    prompt: `From: ${from}\nSubject: ${subject}\n\n${body}`,
  });
  return text.trim();
}

/**
 * Generates a draft reply for an email under 100 words.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body content of the email.
 * @param {string} from - The sender of the email.
 * @param {string} userVoiceContext - The style/context for the user's voice.
 * @returns {Promise<string>} The draft reply string.
 */
export async function generateDraftReply(
  subject: string,
  body: string,
  from: string,
  userVoiceContext: string
): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4.1"),
    system: prompts.GENERATE_DRAFT_PROMPT,
    prompt: `Voice Context: ${userVoiceContext}\n\nEmail to reply to:\nFrom: ${from}\nSubject: ${subject}\n\n${body}`,
  });
  return text.trim();
}

/**
 * Composes a full email based on bullets and tone.
 * @param {string[]} bullets - Key points to include.
 * @param {string} tone - The tone of the email.
 * @param {string} voiceContext - The user's typical voice style.
 * @returns {Promise<string>} The composed email string.
 */
export async function composeEmail(bullets: string[], tone: string, voiceContext: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4.1"),
    system: prompts.COMPOSE_EMAIL_PROMPT,
    prompt: `Tone: ${tone}\nVoice Context: ${voiceContext}\nBullets:\n${bullets.map((b) => "- " + b).join("\n")}`,
  });
  return text.trim();
}

/**
 * Composes a full email based on bullets and tone (Streaming).
 */
export async function composeEmailStream(bullets: string[], tone: string, voiceContext: string): Promise<any> {
  return streamText({
    model: openai("gpt-4.1"),
    system: prompts.COMPOSE_EMAIL_PROMPT,
    prompt: `Tone: ${tone}\nVoice Context: ${voiceContext}\nBullets:\n${bullets.map((b) => "- " + b).join("\n")}`,
  });
}

/**
 * Classifies an email into exactly one of: "important", "team", "vip", "marketing", "social".
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body content of the email.
 * @param {string} from - The sender of the email.
 * @returns {Promise<"important" | "team" | "vip" | "marketing" | "social">} The classification category.
 */
export async function classifyEmail(
  subject: string,
  body: string,
  from: string
): Promise<"important" | "team" | "vip" | "marketing" | "social"> {
  const { text } = await generateText({
    model: openai("gpt-4.1"),
    system: prompts.CLASSIFY_EMAIL_PROMPT,
    prompt: `From: ${from}\nSubject: ${subject}\n\n${body}`,
  });
  
  const category = text.trim().toLowerCase();
  if (["important", "team", "vip", "marketing", "social"].includes(category)) {
    return category as "important" | "team" | "vip" | "marketing" | "social";
  }
  return "important"; // Default fallback
}

/**
 * Rewrites an email in the user's voice context.
 * @param {string} email - The original email string.
 * @param {string} voiceContext - The user's voice context.
 * @returns {Promise<string>} The rewritten email string.
 */
export async function rewriteInVoice(email: string, voiceContext: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4.1"),
    system: prompts.REWRITE_PROMPT,
    prompt: `Voice Context: ${voiceContext}\n\nEmail:\n${email}`,
  });
  return text.trim();
}

/**
 * Rewrites an email in the user's voice context (Streaming).
 */
export async function rewriteInVoiceStream(email: string, voiceContext: string): Promise<any> {
  return streamText({
    model: openai("gpt-4.1"),
    system: prompts.REWRITE_PROMPT,
    prompt: `Voice Context: ${voiceContext}\n\nEmail:\n${email}`,
  });
}
