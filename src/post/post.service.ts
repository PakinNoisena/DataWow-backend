import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "../entities/post.entity";
import { PostRespDto } from "../dto/post.dto";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>
  ) {}

  async findAll(search?: string): Promise<PostRespDto[]> {
    const queryBuilder = this.postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.owner", "owner")
      .leftJoinAndSelect("post.community", "community")
      .select([
        "post.id",
        "post.title",
        "post.description",
        "post.createdAt",
        "post.updatedAt",
        "post.deletedAt",
        "owner.username",
        "community.name",
      ])
      .orderBy("post.createdAt", "DESC");
    // If a search term is provided, apply the LIKE query for the title
    if (search) {
      queryBuilder.where("post.title LIKE :title", { title: `%${search}%` });
    }

    const posts = await queryBuilder.getMany();

    return posts.map((post) => {
      const { owner, community, ...postData } = post;
      return {
        ...postData,
        owner: { username: owner.username },
        community: { name: community.name },
      };
    });
  }
}
