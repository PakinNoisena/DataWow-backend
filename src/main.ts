import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ZodValidationPipe } from "nestjs-zod";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ZodValidationPipe());
  // // routing prefix
  app.setGlobalPrefix("dataWow");

  await app.listen(3000);
}

bootstrap();
