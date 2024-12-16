import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";
import { UserEntity } from "../entities/user.entity";

@Controller("/users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get("/:username")
  async findUserByUsername(
    @Req() context: Request,
    @Param("username") username: string
  ): Promise<UserEntity> {
    const user = await this.userService.findUserByUsername(context, username);

    if (!user) {
      throw new NotFoundException({
        message: `User with username '${username}' not found`,
        messageCode: 1001,
      });
    }

    return user;
  }
}
