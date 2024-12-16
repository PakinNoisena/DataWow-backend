import { Controller, Get, Param, Req } from "@nestjs/common";
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
    return await this.userService.findUserByUsername(context, userName);
  }
}
