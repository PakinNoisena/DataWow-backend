import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ZodValidationPipe } from "nestjs-zod";
import { CustomExceptionFilter } from "./filters/custom-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ZodValidationPipe());
  // // routing prefix
  app.setGlobalPrefix("dataWow");

  // Custom exception filter
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(3000);
}

bootstrap();
