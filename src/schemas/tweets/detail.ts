import { z } from 'zod';

const schema = z.object({
  id: z.coerce.number(),
});

export type SchemaType = z.infer<typeof schema>;

export default schema;
