import { Expose } from "class-transformer";

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
    commentedBy: string; // assuming you want to include the commenter's username
  }> = []; // Initialize as an empty array
}
