import { FileUpload } from 'graphql-upload';
import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { createWriteStream } from 'fs';
import { GraphQLUpload } from 'graphql-upload';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.input';
import { join, normalize } from 'path';
import { updateVideoDto } from './dto/update-video.input';
import { Video } from './entities/video.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { LoginUser } from 'src/auth/login-user.guards';
import { LoginUserRES } from './dto/loginuser.input';

@Resolver(() => Video)
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @Query(() => [Video], { name: 'getAllvideos' })
  async getAllvideos() {
    return this.videoService.findAllVideos();
  }

  @Query(() => [Video])
  async getvideobytitle(@Args('data') data: string): Promise<Video[]> {
    return this.videoService.findVideo(data);
  }

  @Mutation(() => Video)
  @UseGuards(JwtAuthGuard)
  async createVideo(
    @Args('createVideoDto') createVideoDto: CreateVideoDto,
    @LoginUser('loginuser') loginUser: LoginUserRES,
  ): Promise<Video> {
    createVideoDto.userId = loginUser._id;
    return await this.videoService.createVideo(createVideoDto);
  }

  @Mutation(() => Video, { name: 'updateVideo' })
  async updateVideo(
    @Args('_id') _id: string,
    @Args('updateVideoDto') updateVideoDto: updateVideoDto,
  ): Promise<Video> {
    const { title, description, tags, video } = updateVideoDto;
    //console.log(image);
    // const { filename, mimetype, encoding, createReadStream } = await video;
    //console.log(filename, mimetype, encoding, createReadStream);

    if (video) {
      const { filename, mimetype, encoding, createReadStream } = await video;

      if (mimetype !== 'video/mp4' && mimetype !== 'application/octet-stream') {
        throw new Error('Only MP4 video files are allowed.');
      }

      const ReadStream = createReadStream();
      console.log(__dirname);
      const newFilename = `${Date.now()}-${filename}`;
      let savePath = join(__dirname, '..', '..', 'upload', newFilename);
      console.log(savePath);
      const writeStream = await createWriteStream(savePath);
      await ReadStream.pipe(writeStream);
      const baseUrl = process.env.BASE_URL;
      const port = process.env.PORT;
      savePath = `${baseUrl}${port}\\${newFilename}`;

      // Update the video path in the database
      return await this.videoService.updateVideo(_id, {
        title,
        description,
        tags,
        video: savePath,
      });
    } else {
      // If video is not provided, update other fields only
      return await this.videoService.updateVideo(_id, {
        title,
        description,
        tags,
      });
    }
  }

  @Mutation(() => Video, { name: 'deleteVideo' })
  async deleteVideo(@Args('_id') _id: string): Promise<Video> {
    return await this.videoService.deleteVideo(_id);
  }

  @Mutation(() => String, { name: 'deleteOneVideoInfo' })
  async deleteOneField(
    @Args('userId', { type: () => String }) _id: string,
    @Args('fieldToDelete') fieldToDelete: string,
  ) {
    try {
      const result = await this.videoService.deleteOneVideoInfo(
        _id,
        fieldToDelete,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete field');
    }
  }
}
