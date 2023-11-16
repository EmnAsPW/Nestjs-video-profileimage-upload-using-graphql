import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
//import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import * as path from 'path';
//import * as multer from 'multer';
//import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(graphqlUploadExpress());

  // app.use('upload', express.static(path.join(__dirname, 'upload')));

  app.enableCors({ origin: '*' });
  // app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('hello');
}

bootstrap();
