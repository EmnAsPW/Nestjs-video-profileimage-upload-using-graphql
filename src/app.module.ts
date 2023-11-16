import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { VideoModule } from './video/video.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
//import { BookModule } from './book/book.module';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'upload'),
    // }),
    // MongooseModule.forRoot(
    //   'mongodb+srv://emonsourov:haCSbuZrobyBXent@videodb.m3rgdgm.mongodb.net/?retryWrites=true&w=majority',
    // ),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      csrfPrevention: true,
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      ///sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    VideoModule,
    UserModule,
    //ProfileModule,
    AuthModule,
    //BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
