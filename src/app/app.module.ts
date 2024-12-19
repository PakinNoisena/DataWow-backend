import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { ResponseFormat } from "../interceptors/response-format.interceptor";
import { CommunityModule } from "../community/community.module";
import { PostModule } from "../post/post.module";
import { CommentModule } from "../comment/comment.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    CommunityModule,
    PostModule,
    CommentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: "APP_INTERCEPTOR",
      useClass: ResponseFormat,
    },
  ],
})
export class AppModule {}
