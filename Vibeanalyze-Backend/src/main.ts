import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

BigInt.prototype["toJSON"] = function () {
  return Number.parseInt(this.toString()) ?? this.toString();
};

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL
    ]
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('VibeAnalyze API')
    .setDescription('API for analyzing social media content from Instagram and Telegram')
    .setVersion('1.0')
    .addTag('analysis', 'Content analysis endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development') {

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.APP_PORT || 3002);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Documentation available at: ${await app.getUrl()}/api`);
}

bootstrap();
