import {
  Controller,
  Get,
  Query,
  Put,
  Param,
  Body,
  Headers,
  Delete,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { PostBodyDto, PostRespDto } from "../dto/post.dto";
import { PostResponse } from "./post.interface";

@Controller("/post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get("/")
  async findAllPost(@Query("search") search?: string): Promise<PostResponse[]> {
    const posts = await this.postService.findAll(search);
    return posts;
  }

  @Put("/:id")
  async editPost(
    @Param("id") postId: string,
    @Headers("user-id") userId: string,
    @Body() updateData: Partial<PostBodyDto>
  ): Promise<PostResponse> {
    const updatedPost = await this.postService.edit(postId, userId, updateData);
    return updatedPost;
  }

  @Delete("/:id")
  async deletePost(
    @Param("id") postId: string,
    @Headers("user-id") userId: string
  ): Promise<void> {
    await this.postService.delete(postId, userId);
  }
}
