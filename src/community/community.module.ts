import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommunityEntity } from "../entities/community.entity";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([CommunityEntity]), UsersModule],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
