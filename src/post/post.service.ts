import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "../entities/post.entity";
import { PostBodyDto, PostRespDto } from "../dto/post.dto";
import { CommentEntity } from "../entities/comment.entity";
import { CommentService } from "../comment/comment.service";
import { CommunityEntity } from "../entities/community.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    private commentService: CommentService,
    @InjectRepository(CommunityEntity)
    private communityRepo: Repository<CommunityEntity>
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

  async edit(
    postId: string,
    userId: string,
    updateData: Partial<PostBodyDto>
  ): Promise<PostRespDto> {
    // Find the post by ID
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ["owner", "community"],
    });

    if (!post) {
      throw new NotFoundException({
        message: `Post '${post}' not found`,
        messageCode: 2001,
      });
    }

    // Check if the post owner matches the current user
    if (post.owner.id !== userId) {
      throw new ForbiddenException({
        message: `You are not the owner of this post`,
        messageCode: 1002,
      });
    }

    // Check if the community exists and update it
    if (updateData.communityId) {
      const community = await this.communityRepo.findOne({
        where: { id: updateData.communityId }, // Use the ID directly
      });
      if (!community) {
        throw new NotFoundException({
          message: "Community id  not found",
          messageCode: 3001,
        });
      }
      post.community = community; // Update community
    }

    // Update allowed fields (title, description, community)
    if (updateData.title) post.title = updateData.title;
    if (updateData.description) post.description = updateData.description;

    // Set the updated time
    post.updatedAt = new Date();

    // Save the updated post
    const updatedPost = await this.postRepo.save(post);

    // Return the updated post data in PostRespDto format
    return {
      id: updatedPost.id,
      title: updatedPost.title,
      description: updatedPost.description,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
      deletedAt: updatedPost.deletedAt,
      owner: {
        username: updatedPost.owner.username,
      },
      community: {
        name: updatedPost.community.name,
      },
      comments: [], // Optionally populate comments if needed
    };
  }

  async deleteCommentsByPostId(postId: string): Promise<void> {
    await this.commentService.deleteByPostId(postId);
  }

  async delete(postId: string, userId: string): Promise<void> {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ["owner", "community"],
    });

    if (!post) {
      throw new NotFoundException({
        message: `Post '${postId}' not found`,
        messageCode: 2001,
      });
    }

    if (post.owner.id !== userId) {
      throw new ForbiddenException({
        message: `You are not the owner of this post`,
        messageCode: 1002,
      });
    }

    // Delete related comments
    await this.deleteCommentsByPostId(postId);

    // Delete the post
    await this.postRepo.delete(postId);
  }
}
