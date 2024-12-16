import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "../entities/post.entity";
import { PostRespDto } from "../dto/post.dto";
import { CommentEntity } from "../entities/comment.entity";
import { CommentService } from "../comment/comment.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    private commentService: CommentService
  ) {}

  async findAll(search?: string): Promise<PostRespDto[]> {
    const queryBuilder = this.postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.owner", "owner")
      .leftJoinAndSelect("post.community", "community")
      .select([
        "post.id",
        "post.title",
        "post.description",
        "post.createdAt",
        "post.updatedAt",
        "post.deletedAt",
        "owner.username",
        "community.name",
      ])
      .orderBy("post.createdAt", "DESC");

    if (search) {
      queryBuilder.where("post.title LIKE :title", { title: `%${search}%` });
    }

    const posts = await queryBuilder.getMany();

    const postResults = posts.map((post) => {
      const { owner, community, ...postData } = post;
      return {
        ...postData,
        owner: { username: owner.username },
        community: { name: community.name },
        comments: [], // Initialize comments as an empty array
      };
    });

    const postIds = postResults.map((post) => {
      return post.id;
    });

    // Get all comments
    const commentResults = await this.commentService.findAll(postIds);

    // Add comments to each post in postResults
    postResults.forEach((post) => {
      // Filter comments for the current post
      const postComments = commentResults.filter((com) => {
        return com.post.id === post.id;
      });

      // Add the comments to the post if any
      (post as any).comments = postComments.map((comment) => ({
        id: comment.id,
        message: comment.message,
        createdAt: comment.createdAt,
        commentedBy: comment.commentedBy.username,
      }));
    });

    return postResults;
  }
}
