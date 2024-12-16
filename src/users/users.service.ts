import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./../entities/user.entity";
import { Request } from "express";
import { UserBodyDto } from "../dto/users.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>
  ) {}

  async findUserByUsername(
    context: Request,
    username: string
  ): Promise<UserEntity | null> {
    const user = await this.repo.findOne({
      where: {
        username,
      },
    });
    return user;
  }

  async create(context: Request, body: UserBodyDto): Promise<UserEntity> {
    const user = this.repo.create({ username: body.username });
    await this.repo.save(user);

    return user;
  }
}
