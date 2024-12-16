import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommunityEntity } from "../entities/community.entity";

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(CommunityEntity)
    private communityRepo: Repository<CommunityEntity>
  ) {}

  async findAll(): Promise<CommunityEntity[]> {
    const communities = await this.communityRepo.find();
    return communities;
  }
}
