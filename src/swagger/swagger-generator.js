const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../../dist/app.module');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const fs = require('fs');

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('dist/swagger.json', JSON.stringify(document));
  process.exit(0);
}

generateSwagger();