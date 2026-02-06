import z from "zod";

export const DepartmentsTypeSchema = z.enum([
  'College of Engineering',
  'College of Architecture',
  'College of Business Administration',
  'School of Teachers Education',
  'College of Arts and Sciences',
  'College of Information Technology',
])