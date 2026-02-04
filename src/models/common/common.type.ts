import { z } from "zod";
import { PaginationSchema } from "./common.schema";

export type Pagination = z.infer<typeof PaginationSchema>;