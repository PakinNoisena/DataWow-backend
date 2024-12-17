import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "../entities/post.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { CommentEntity } from "../entities/comment.entity";
import { CommunityEntity } from "../entities/community.entity";
import { CommentService } from "../comment/comment.service";
import { CommunityService } from "../community/community.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, CommentEntity, CommunityEntity]),
  ],
  controllers: [PostController],
  providers: [PostService, CommentService, CommunityService],
})
export class PostModule {}
