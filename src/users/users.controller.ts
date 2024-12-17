import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";
import { UserEntity } from "../entities/user.entity";
import { UserBodyDto } from "../dto/users.dto";
import { USER_ERR } from "../config/constant.config";

@Controller("/users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get("/:username")
  async findUserByUsername(
    @Req() context: Request,
    @Param("username") username: string
  ): Promise<UserEntity | null> {
    const user = await this.userService.findUserByUsername(context, username);

    if (!user) {
      throw new NotFoundException(USER_ERR.USERNAME_NOT_FOUND(username));
    }

    return user;
  }

  @Post("/signin")
  async signIn(
    @Req() context: Request,
    @Body() body: UserBodyDto
  ): Promise<UserEntity | null> {
    const user = await this.userService.signIn(context, body);
    return user;
  }
}
