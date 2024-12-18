import {
  Controller,
  Get,
  Query,
  Put,
  Param,
  Body,
  Headers,
  Delete,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { PostCreateBodyDto, PostUpdateBodyDto } from "../dto/post.dto";
import { PostResponse } from "./post.interface";
import { CheckUserExistGuard } from "../guards/authorization.guard";

@Controller("/post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get("/")
  async findAllPost(
    @Query("search") search?: string,
    @Query("community") community?: string,
    @Query("userId") userId?: string
  ): Promise<PostResponse[]> {
    const posts = await this.postService.findAll(search, community, userId);
    return posts;
  }

  @Put("/:id")
  @UseGuards(CheckUserExistGuard)
  async editPost(
    @Param("id") postId: string,
    @Headers("user-id") userId: string,
    @Body() updateData: PostUpdateBodyDto
  ): Promise<PostResponse> {
    const updatedPost = await this.postService.edit(postId, userId, updateData);
    return updatedPost;
  }

  @Delete("/:id")
  @UseGuards(CheckUserExistGuard)
  async deletePost(
    @Param("id") postId: string,
    @Headers("user-id") userId: string
  ): Promise<void> {
    await this.postService.delete(postId, userId);
  }

  @Get("/:id")
  async findOnePost(@Param("id") postId: string): Promise<PostResponse> {
    const post = await this.postService.findOneById(postId);
    return post;
  }

  @Post("/")
  @UseGuards(CheckUserExistGuard)
  async createPost(
    @Headers("user-id") userId: string,
    @Body() createData: PostCreateBodyDto
  ): Promise<PostResponse> {
    const newPost = await this.postService.create(userId, createData);
    return newPost;
  }
}
