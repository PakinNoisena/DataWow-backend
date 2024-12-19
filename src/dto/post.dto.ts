import { Expose } from "class-transformer";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const PostUpdateBodySchema = z.object({
  title: z
    .string()
    .min(1, "Username cannot be empty")
    .refine((value) => value !== null && value !== undefined, {
      message: "Username cannot be null or undefined",
    })
    .optional(),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .refine((value) => value !== null && value !== undefined, {
      message: "Description cannot be null or undefined",
    })
    .optional(),
  communityId: z
    .number()
    .refine((value) => value !== null && value !== undefined, {
      message: "Community ID cannot be null or undefined",
    })
    .optional(),
});

export class PostUpdateBodyDto extends createZodDto(PostUpdateBodySchema) {}

const PostCreateBodySchema = z.object({
  title: z
    .string()
    .min(1, "Username cannot be empty")
    .refine((value) => value !== null && value !== undefined, {
      message: "Username cannot be null or undefined",
    }),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .refine((value) => value !== null && value !== undefined, {
      message: "Description cannot be null or undefined",
    }),
  communityId: z
    .number()
    .refine((value) => value !== null && value !== undefined, {
      message: "Community ID cannot be null or undefined",
    }),
});

export class PostCreateBodyDto extends createZodDto(PostCreateBodySchema) {}
