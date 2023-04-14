import { z } from 'zod';

const schema = z.object({
  name: z.string(),
});

export type SchemaType = z.infer<typeof schema>;

export default schema;
