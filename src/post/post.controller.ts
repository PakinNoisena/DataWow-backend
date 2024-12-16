import { Controller, Get, Query } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostEntity } from "../entities/post.entity";
import { PostRespDto } from "../dto/post.dto";

@Controller("/post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get("/")
  async findAllPost(@Query("search") search?: string): Promise<PostRespDto[]> {
    const posts = await this.postService.findAll(search);
    return posts;
  }
}
