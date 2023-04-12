import { z } from 'zod';

export function getZodIssuesMessageByFieldName(
  zodIssues: z.ZodIssue[],
  fieldName: string
) {
  return zodIssues.find((issue) => issue.path[0] === fieldName)?.message;
}
