import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as fs from 'fs';
import * as morgan from 'morgan';
import path = require('path');

import { AppModule } from './app.module';

const folderPath = path.join(process.cwd(), 'logs');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(folderPath, 'api.log'), {
  flags: 'a', //append
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api'); // http://localhost:3000/api
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('combined', { stream: logStream })); //log View prettier
  await app.listen(3000);
}
bootstrap();
