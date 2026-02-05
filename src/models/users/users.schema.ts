import { PaginationSchema } from "@models/common/common.schema";
import { z } from "zod";

export const UserRolesSchema = z.enum(['super_admin', 'admin', 'participant']);
export const UserStatusSchema = z.enum(['active', 'inactive', 'needs_verification']);

export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  status: UserStatusSchema,
  password: z.string(),
  avatar: z.string().nullable(),
  role: UserRolesSchema,
  workspace_id: z.string().nullable().default(null),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetUserSchema = UserSchema;
export const GetPaginatedUsersSchema = PaginationSchema.extend({
  data: z.array(UserSchema),
});
export const GetPaginatedUsersFiltersSchema = z.object({
  q: z.string().optional(),
  status: UserStatusSchema.optional(),
  role: UserRolesSchema.optional(),
});
export const PostUserSchema = UserSchema;
export const PutUserSchema = UserSchema.omit({ id: true, password: true });
export const PatchUserSchema = UserSchema.omit({ id: true, password: true }).partial();