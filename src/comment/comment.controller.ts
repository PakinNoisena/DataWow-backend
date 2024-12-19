import {
  Body,
  Controller,
  Post,
  Param,
  UseGuards,
  Headers,
  Header,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentDto } from "../dto/comment.dto";
import { CommentEntity } from "../entities/comment.entity";
import { CheckUserExistGuard } from "../guards/authorization.guard";

@Controller("/comment")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post("/:postId")
  @UseGuards(CheckUserExistGuard)
  async create(
    @Headers("user-id") userId: string,
    @Param("postId") postId: string,
    @Body() createData: CommentDto
  ): Promise<CommentEntity> {
    const comment = await this.commentService.create(
      userId,
      postId,
      createData
    );
    return comment;
  }
}
