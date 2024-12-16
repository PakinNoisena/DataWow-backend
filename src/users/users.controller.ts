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

  @Get("/:userName")
  async findOneUser(
    @Req() context: Request,
    @Param("userName") userName: string
  ): Promise<UserEntity> {
    const user = await this.userService.findUserByUsername(context, userName);

    if (!user) {
      throw new NotFoundException({
        message: `User with username '${userName}' not found`,
        messageCode: 1001,
      });
    }

    return user;
  }
}
