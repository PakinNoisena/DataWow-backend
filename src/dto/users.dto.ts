import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const UserBodySchema = z.object({
  username: z
    .string()
    .min(1, "Username cannot be empty")
    .refine((value) => value !== null && value !== undefined, {
      message: "Username cannot be null or undefined",
    }),
});

export class UserBodyDto extends createZodDto(UserBodySchema) {}
