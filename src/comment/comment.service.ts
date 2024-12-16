import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { CommentEntity } from "../entities/comment.entity";
import { PostEntity } from "../entities/post.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>
  ) {}

  async findAll(postIds: string[]): Promise<CommentEntity[]> {
    const queryOptions: any = {
      order: {
        createdAt: "DESC",
      },
    };

    // Add where condition only if postIds has a length
    if (postIds.length > 0) {
      queryOptions.where = {
        post: { id: In(postIds) },
      };
    }

    const comments = await this.commentRepo.find(queryOptions);

    return comments;
  }

  async deleteByPostId(postId: string): Promise<void> {
    await this.commentRepo.delete({ post: { id: postId } });
  }
}
