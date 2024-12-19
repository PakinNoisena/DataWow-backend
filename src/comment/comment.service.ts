import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { CommentEntity } from "../entities/comment.entity";
import { CommentDto } from "../dto/comment.dto";
import { UsersService } from "../users/users.service";
import { PostService } from "../post/post.service";
import { POST_ERR, USER_ERR } from "../config/constant.config";
import { PostEntity } from "../entities/post.entity";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    private userService: UsersService,
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>
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

  async create(
    userId: string,
    postId: string,
    commentDto: CommentDto
  ): Promise<CommentEntity> {
    // Find the post to which the comment will be associated
    const post = await this.postRepo.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(POST_ERR.NOT_FOUND);
    }

    // Find the user who is creating the comment
    const user = await this.userService.findUserByUserId(userId);

    if (!user) {
      throw new NotFoundException(USER_ERR.USER_NOT_FOUND);
    }

    // Create a new comment entity
    const comment = this.commentRepo.create({
      message: commentDto.message,
      post: post, // Pass the entire PostEntity, not just the id
      commentedBy: user, // Pass the entire UserEntity, not just the id
      createdAt: new Date(),
    });

    // Save the new comment to the database
    const savedComment = await this.commentRepo.save(comment);

    return savedComment;
  }
}
