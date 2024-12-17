import { Expose } from "class-transformer";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const PostBodySchema = z.object({
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
    .positive("Community ID must be greater than 0")
    .refine((value) => value !== null && value !== undefined, {
      message: "Community ID cannot be null or undefined",
    })
    .optional(),
});

export class PostBodyDto extends createZodDto(PostBodySchema) {}

// Update this to reflect the type of comments
export class PostRespDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  deletedAt?: Date;

  @Expose()
  owner!: {
    username: string;
  };

  @Expose()
  community!: {
    name: string;
  };

  // Define the type of comments as an array of objects with the correct shape
  @Expose()
  comments: Array<{
    id: string;
    message: string;
    createdAt: Date;
    commentedBy: string;
  }> = [];
}
