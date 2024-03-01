import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
const fs = require('fs');
export function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Open Food Facts Scraping API')
    .setDescription('API desenvolvida como parte do desafio técnico IN8')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  fs.writeFileSync('swagger.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
}