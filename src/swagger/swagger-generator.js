const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../../dist/app.module');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const fs = require('fs');

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Open Food Facts Scraping API')
    .setDescription('Esta realiza scraping do site Open Food Facts possibilitando a busca de um produto específico através do seu código ou uma lista de produtos.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('dist/swagger.json', JSON.stringify(document));
  process.exit(0);
}

generateSwagger();
