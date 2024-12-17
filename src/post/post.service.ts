import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "../entities/post.entity";
import { PostCreateBodyDto, PostUpdateBodyDto } from "../dto/post.dto";
import { CommentEntity } from "../entities/comment.entity";
import { CommentService } from "../comment/comment.service";
import { CommunityEntity } from "../entities/community.entity";
import { COMMUNITY_ERR, POST_ERR, USER_ERR } from "../config/constant.config";
import { PostComment, PostResponse } from "./post.interface";
import { CommunityService } from "../community/community.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    private commentService: CommentService,
    private communityService: CommunityService,
    private userService: UsersService
  ) {}

  async findOneById(id: string): Promise<PostResponse> {
    const queryBuilder = this.postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.owner", "owner")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.comments", "comment")
      .leftJoinAndSelect("comment.commentedBy", "commentedBy")
      .select([
        "post.id",
        "post.title",
        "post.description",
        "post.createdAt",
        "post.updatedAt",
        "post.deletedAt",
        "owner.username",
        "community.name",
        "community.id",
        "comment.id",
        "comment.message",
        "comment.createdAt",
        "comment.commentedBy",
        "commentedBy.username",
      ])
      .where("post.id = :id", { id })
      .orderBy("post.createdAt", "DESC");

    const post = await queryBuilder.getOne();

    if (!post) {
      throw new NotFoundException(POST_ERR.NOT_FOUND);
    }

    // Mapping the result to match the PostResponse structure
    const { owner, community, comments, ...postData } = post;

    return {
      ...postData,
      owner: { username: owner.username },
      community: { id: community.id, name: community.name },
      comments: comments.map((comment) => ({
        id: comment.id,
        message: comment.message,
        createdAt: comment.createdAt,
        commentedBy: comment.commentedBy.username,
      })),
    };
  }

  async findAll(search?: string): Promise<PostResponse[]> {
    const queryBuilder = this.postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.owner", "owner")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.comments", "comment")
      .leftJoinAndSelect("comment.commentedBy", "commentedBy")
      .select([
        "post.id",
        "post.title",
        "post.description",
        "post.createdAt",
        "post.updatedAt",
        "post.deletedAt",
        "owner.username",
        "community.name",
        "community.id",
        "comment.id",
        "comment.message",
        "comment.createdAt",
        "comment.commentedBy",
        "commentedBy.username",
      ])
      .orderBy("post.createdAt", "DESC");

    if (search) {
      queryBuilder.where("post.title LIKE :title", { title: `%${search}%` });
    }

    const posts = await queryBuilder.getMany();

    const postResults: PostResponse[] = posts.map((post) => {
      const { owner, community, comments, ...postData } = post;

      return {
        ...postData,
        owner: { username: owner.username },
        community: { id: community.id, name: community.name },
        comments: comments.map((comment) => ({
          id: comment.id,
          message: comment.message,
          createdAt: comment.createdAt,
          commentedBy: comment.commentedBy.username,
        })),
      };
    });

    return postResults;
  }

  async edit(
    postId: string,
    userId: string,
    updateData: PostUpdateBodyDto
  ): Promise<PostResponse> {
    // Find the post by ID
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ["owner", "community"],
    });

    if (!post) {
      throw new NotFoundException(POST_ERR.NOT_FOUND);
    }

    // Check if the post owner matches the current user
    if (post.owner.id !== userId) {
      throw new ForbiddenException(POST_ERR.NOT_POST_OWNER);
    }

    if (updateData.communityId) {
      const community = await this.communityService.findOneById(
        updateData.communityId
      );
      post.community = community;
    }

    // Update allowed fields (title, description, community)
    if (updateData.title) post.title = updateData.title;
    if (updateData.description) post.description = updateData.description;

    // Set the updated time
    post.updatedAt = new Date();

    // Save the updated post
    await this.postRepo.save(post);

    const results = await this.findOneById(postId);

    return results;
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
      throw new NotFoundException(POST_ERR.NOT_FOUND);
    }

    if (post.owner.id !== userId) {
      throw new ForbiddenException(POST_ERR.NOT_POST_OWNER);
    }

    // Delete related comments
    await this.deleteCommentsByPostId(postId);

    // Delete the post
    await this.postRepo.delete(postId);
  }

  async create(
    userId: string,
    createData: PostCreateBodyDto
  ): Promise<PostResponse> {
    const community = await this.communityService.findOneById(
      createData.communityId
    );

    const user = await this.userService.findUserByUserId(userId);
    if (!user) {
      throw new NotFoundException(USER_ERR.USER_NOT_FOUND);
    }

    const postEntity = this.postRepo.create({
      title: createData.title,
      description: createData.description,
      community: community,
      owner: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedPost = await this.postRepo.save(postEntity);

    const postResponse = await this.findOneById(savedPost.id);

    return postResponse;
  }
}
