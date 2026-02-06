import { PaginationSchema } from "@models/common/common.schema";
import { GroupsSchema } from "@models/groups/groups.schema";
import { WorkspaceSchema } from "@models/workspace/workspace.schema";
import z from "zod";

export const ParticipantsSchema = z.object({
  id: z.uuid(),
  rfid_number: z.string(),
  name: z.string(),
  department: z.string(),
  group_id: z.uuid(),
  workspace_id: z.uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetParticipantSchema = ParticipantsSchema.extend({
  workspace: WorkspaceSchema.pick({ id: true, name: true }),
  group: GroupsSchema.pick({ id: true, name: true }),
})
  
export const GetParticipantsPaginationSchema = PaginationSchema.extend({
  data: z.array(GetParticipantSchema),
});

export const PostParticipantsSchema = ParticipantsSchema;
export const BulkPostParticipantsSchema = z.array(PostParticipantsSchema);
export const PatchParticipantsSchema = ParticipantsSchema.omit({ id: true, created_at: true }).partial();
export const DeleteParticipantsSchema = ParticipantsSchema.pick({ id: true });
export const DeleteBulkParticipantsSchema = z.array(DeleteParticipantsSchema.pick({ id: true }));