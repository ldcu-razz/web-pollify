import { z } from "zod";
import { GetPaginatedUsersSchema, PostUserSchema, PatchUserSchema, GetUserSchema, UserSchema, PutUserSchema } from "./users.schema";

export type User = z.infer<typeof UserSchema>;
export type GetUser = z.infer<typeof GetUserSchema>;
export type GetPaginatedUsers = z.infer<typeof GetPaginatedUsersSchema>;
export type PostUser = z.infer<typeof PostUserSchema>;
export type PutUser = z.infer<typeof PutUserSchema>;
export type PatchUser = z.infer<typeof PatchUserSchema>;