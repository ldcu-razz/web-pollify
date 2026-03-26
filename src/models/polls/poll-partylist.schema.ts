import z from "zod";

export const PollPartylistSchema = z.object({
  id: z.string(),
  poll_id: z.string(),
  name: z.string(),
  description: z.string(),
  avatar: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const GetPartyListSchema = PollPartylistSchema;
export const PostPartyListSchema = PollPartylistSchema;
export const PatchPartyListSchema = PollPartylistSchema.partial();
export const DeletePartyListSchema = z.object({
  id: z.string(),
});