import { DepartmentsTypeSchema } from "./departments.schema";
import z from "zod";

export type DepartmentsType = z.infer<typeof DepartmentsTypeSchema>;