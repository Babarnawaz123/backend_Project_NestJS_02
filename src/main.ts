// src/main.ts
import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Overrides system DNS for SRV record lookups

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ... rest of your main.ts setup

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Serve static assets from public/uploads
  app.useStaticAssets(join(__dirname, '..', 'public/uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('Products & Auth API - Task 2')
    .setDescription(
      'NestJS Backend API with Auth, RBAC, Image Uploads, and Swagger',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
