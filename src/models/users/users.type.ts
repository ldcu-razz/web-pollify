import { z } from "zod";
import { GetPaginatedUsersSchema, PostUserSchema, PatchUserSchema, GetUserSchema, UserSchema, PutUserSchema, GetPaginatedUsersFiltersSchema, UserStatusSchema, UserRolesSchema } from "./users.schema";

export type User = z.infer<typeof UserSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type UserRoles = z.infer<typeof UserRolesSchema>;
export type GetUser = z.infer<typeof GetUserSchema>;
export type GetPaginatedUsers = z.infer<typeof GetPaginatedUsersSchema>;
export type GetPaginatedUsersFilters = z.infer<typeof GetPaginatedUsersFiltersSchema>;
export type PostUser = z.infer<typeof PostUserSchema>;
export type PutUser = z.infer<typeof PutUserSchema>;
export type PatchUser = z.infer<typeof PatchUserSchema>;