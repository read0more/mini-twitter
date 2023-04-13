import { z } from 'zod';

const schema = z.object({
  text: z.string().min(1, '내용을 입력해주세요.'),
});

export type SchemaType = z.infer<typeof schema>;

export default schema;
