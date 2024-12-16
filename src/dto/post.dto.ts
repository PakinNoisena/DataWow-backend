import { Expose } from "class-transformer";

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
  owner!: {
    username: string;
  };

  @Expose()
  community!: {
    name: string;
  };
}
