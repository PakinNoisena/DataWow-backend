import { Controller, Get, UseGuards } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CommunityEntity } from "../entities/community.entity";
import { CheckUserExistMiddleware } from "../middleware/authorization.middleware";

@Controller("/community")
@UseGuards(CheckUserExistMiddleware)
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get("/")
  async findAllCommunity(): Promise<CommunityEntity[]> {
    const community = await this.communityService.findAll();

    return community;
  }
}
