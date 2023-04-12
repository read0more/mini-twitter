import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  payload: z.string(),
});

export type SchemaType = z.infer<typeof schema>;

export default schema;
