import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional().default(''),
});

export type SchemaType = z.infer<typeof schema>;

export default schema;
