import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentService } from "../comment/comment.service";
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";
import { CommentEntity } from "../entities/comment.entity";
import { PostEntity } from "../entities/post.entity";
import { CommentController } from "./comment.controller";
import { UserEntity } from "../entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity]),
    UsersModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, UsersService],
})
export class CommentModule {}
