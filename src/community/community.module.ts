import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommunityEntity } from "../entities/community.entity";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { UsersModule } from "../users/users.module";
import { CheckUserExistMiddleware } from "../middleware/authorization.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([CommunityEntity]), UsersModule],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the CheckUserExistMiddleware only to routes in the CommunityController
    consumer
      .apply(CheckUserExistMiddleware) // Registering middleware
      .forRoutes(CommunityController); // Apply to all routes in this controller
  }
}
