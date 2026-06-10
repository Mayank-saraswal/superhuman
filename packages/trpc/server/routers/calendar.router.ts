import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedures";
import { getTenant } from "../utils/tenant";

export const calendarRouter = router({
  getEvents: protectedProcedure
    .input(z.object({
      start: z.string(),
      end: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      const res = await tenant.googlecalendar.api.events.getMany({ 
        calendarId: 'primary',
        timeMin: input.start, 
        timeMax: input.end 
      });
      return { events: res.items || [] };
    }),

  createEvent: protectedProcedure
    .input(z.object({
      title: z.string(),
      start: z.string(),
      end: z.string(),
      attendees: z.array(z.string()).optional(),
      description: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      
      const attendees = input.attendees?.map(email => ({ email })) || [];
      
      const res = await tenant.googlecalendar.api.events.create({
        calendarId: 'primary',
        event: {
          summary: input.title,
          description: input.description,
          start: { dateTime: input.start },
          end: { dateTime: input.end },
          attendees
        }
      });

      return { event: res };
    }),

  createEventFromEmail: protectedProcedure
    .input(z.object({
      messageId: z.string(),
      title: z.string(),
      start: z.string(),
      end: z.string(),
      attendees: z.array(z.string())
    }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      
      // Fetch email to get details or link
      const email = await tenant.gmail.api.messages.get({ id: input.messageId });
      const description = `Generated from email thread.\n\nContext:\n${email.snippet}`;

      const attendees = input.attendees.map(email => ({ email }));

      const res = await tenant.googlecalendar.api.events.create({
        calendarId: 'primary',
        event: {
          summary: input.title,
          description,
          start: { dateTime: input.start },
          end: { dateTime: input.end },
          attendees
        }
      });

      return { event: res };
    }),

  getFreeSlots: protectedProcedure
    .input(z.object({
      participants: z.array(z.string()),
      durationMinutes: z.number(),
      withinDays: z.number().default(7)
    }))
    .query(async ({ ctx, input }) => {
      const tenant = await getTenant(ctx.user.clerkId);
      
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + input.withinDays * 24 * 60 * 60 * 1000).toISOString();

      const items = [{ id: 'primary' }, ...input.participants.map(email => ({ id: email }))];

      // Simple implementation: just returning mock freeBusy response.
      // Corsair does not expose the freebusy endpoint directly in this version.
      return { 
        freeBusy: {
          primary: { busy: [] }
        } 
      };
    })
});
