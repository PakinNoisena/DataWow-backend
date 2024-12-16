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

  @Post("/signin")
  async signIn(
    @Req() context: Request,
    @Body() body: UserBodyDto
  ): Promise<UserEntity> {
    // find user to check exist
    let user = await this.userService.findUserByUsername(
      context,
      body.username
    );

    // create if user not exist
    if (!user) {
      user = await this.userService.create(context, body);
    }

    return user;
  }
}
