import { Controller, Get } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CommunityEntity } from "../entities/community.entity";

@Controller("/community")
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get("/")
  async findAllCommunity(): Promise<CommunityEntity[]> {
    const community = await this.communityService.findAll();

    return community;
  }
}
