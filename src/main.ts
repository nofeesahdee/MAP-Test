import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config, IConfig } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<IConfig>);
  const port = config.get(Config.Port);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  console.log(`Running on port ${port}`);
}
bootstrap();