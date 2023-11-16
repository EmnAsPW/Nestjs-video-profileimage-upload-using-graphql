import { forwardRef, Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoResolver } from './video.resolver';
import { UserModule } from 'src/user/user.module';
import { Video, VideoSchema } from './entities/video.entity';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    //forwardRef(() => UserModule), // Use forwardRef here
  ],
  controllers: [],
  providers: [VideoService, VideoResolver],
  exports: [VideoService],
})
export class VideoModule {}
