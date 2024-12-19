import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const CommentBodySchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .refine((value) => value !== null && value !== undefined, {
      message: "Message cannot be null or undefined",
    }),
});

export class CommentDto extends createZodDto(CommentBodySchema) {}
