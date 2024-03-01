import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { setupSwagger } from './swagger/swagger-setup';

async function bootstrap() {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
  config({ path: envFile });
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
