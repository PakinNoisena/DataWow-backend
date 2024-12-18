import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "../entities/post.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { CommentEntity } from "../entities/comment.entity";
import { CommunityEntity } from "../entities/community.entity";
import { CommentService } from "../comment/comment.service";
import { CommunityService } from "../community/community.service";
import { UsersService } from "../users/users.service";
import { UserEntity } from "../entities/user.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      CommentEntity,
      CommunityEntity,
      UserEntity,
    ]),
    UsersModule,
  ],
  controllers: [PostController],
  providers: [PostService, CommentService, CommunityService, UsersService],
})
export class PostModule {}
