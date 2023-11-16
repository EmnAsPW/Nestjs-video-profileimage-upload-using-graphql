import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Video, VideoSchema } from 'src/video/entities/video.entity';
import { FindSchema, UserVideo } from './entities/uservideo.entity';
//import { SharedModule } from './dto/shared.module';

@Module({
  providers: [UserResolver, UserService, ConfigService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Video.name, schema: VideoSchema },
      { name: UserVideo.name, schema: FindSchema },
    ]),
    ConfigModule.forRoot({
      cache: true,
    }),
    //SharedModule,
  ],
  exports: [UserService],
})
export class UserModule {}
