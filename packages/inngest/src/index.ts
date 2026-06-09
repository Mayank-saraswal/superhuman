import { inngestClient as inngest } from "@superhuman/events";
import {
  onMessageReceived,
  checkFollowUp,
  onCalendarEventChanged,
  linearDigestCron,
} from "./functions";

export { inngest };

/**
 * Array of all Inngest functions to be registered with the Inngest serve endpoint.
 */
export const inngestFunctions = [
  onMessageReceived,
  checkFollowUp,
  onCalendarEventChanged,
  linearDigestCron,
];
