import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createWriteStream } from 'fs';
import { Model, Types, UpdateQuery } from 'mongoose';
import { join, normalize } from 'path';
//import { Video, VideoDocument } from './video.schema';
import { CreateVideoDto } from './dto/create-video.input';
//import { FileUpload } from 'graphql-upload';
import { updateVideoDto } from './dto/update-video.input';
import { NotFoundException } from '@nestjs/common';
import { Video, VideoDocument } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const { title, description, tags, video, userId } = createVideoDto;
    //createVideoDto.userId="lskdfjaslk";
    console.log('...........', userId);
    const resp = await video;
    const { filename, mimetype, encoding, createReadStream } = resp;
    console.log(filename, mimetype, encoding, createReadStream);

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
    const userIdAsObjectId = new Types.ObjectId(userId);
    return await this.videoModel.create({
      title,
      description,
      tags,
      video: savePath,
      userId: userIdAsObjectId,
    });
  }

  async findAllVideos(): Promise<Video[]> {
    return await this.videoModel.find({});
  }

  async findVideo(data: string): Promise<Video[]> {
    return await this.videoModel
      .find({ $text: { $search: data } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } });
  }

  // async updateVideo(
  //   _id: string,
  //   data: UpdateQuery<VideoDocument> | updateVideoDto,
  // ): Promise<Video> {
  //   return await this.videoModel.findByIdAndUpdate(_id, data, { new: true });
  // }

  async updateVideo(
    _id: string,
    data: UpdateQuery<updateVideoDto>,
  ): Promise<Video> {
    return await this.videoModel.findByIdAndUpdate(_id, data, { new: true });
  }

  async deleteVideo(_id: string): Promise<Video> {
    return await this.videoModel.findByIdAndDelete(_id);
  }

  async deleteOneVideoInfo(_id: string, fieldToDelete: string) {
    try {
      const video = await this.videoModel.findById(_id).exec();

      if (!video) {
        return 'Video Not Found';
      }

      if (video[fieldToDelete] !== undefined) {
        const updateQuery = { $unset: { [fieldToDelete]: 1 } };

        await this.videoModel
          .findByIdAndUpdate(_id, updateQuery, { new: true })
          .exec();
        return `Successfully deleted ${fieldToDelete} from Video`;
      } else {
        return `${fieldToDelete} not found in Video`;
      }
    } catch (error) {
      throw new NotFoundException('Video Not Found');
    }
  }

  async updateOneVideoInfo(
    _id: string,
    fieldToUpdate: string,
    newValue: string,
  ) {
    try {
      const video = await this.videoModel.findById(_id).exec();

      if (!video) {
        return 'Video Not Found';
      }

      if (video[fieldToUpdate] !== undefined) {
        const updateQuery = { [fieldToUpdate]: newValue };

        const updatedVideo = await this.videoModel
          .findByIdAndUpdate(_id, updateQuery, { new: true })
          .exec();

        return `Successfully updated ${fieldToUpdate} in Video. New value: ${updatedVideo[fieldToUpdate]}`;
      } else {
        return `${fieldToUpdate} not found in Video`;
      }
    } catch (error) {
      throw new NotFoundException('Video Not Found');
    }
  }
}
