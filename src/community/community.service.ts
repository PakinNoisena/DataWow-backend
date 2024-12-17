import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommunityEntity } from "../entities/community.entity";
import { COMMUNITY_ERR } from "../config/constant.config";

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(CommunityEntity)
    private communityRepo: Repository<CommunityEntity>
  ) {}

  async findOneById(id: number): Promise<CommunityEntity> {
    const community = await this.communityRepo.findOne({ where: { id } });
    if (!community) {
      throw new NotFoundException(COMMUNITY_ERR.ID_NOT_FOUND);
    }
    return community;
  }

  async findAll(): Promise<CommunityEntity[]> {
    const communities = await this.communityRepo.find();
    return communities;
  }
}
