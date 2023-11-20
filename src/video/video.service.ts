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
    //console.log('...........', userId);
    const resp = await video;
    const { filename, mimetype, encoding, createReadStream } = resp;
    //console.log(filename, mimetype, encoding, createReadStream);

    if (mimetype !== 'video/mp4' && mimetype !== 'application/octet-stream') {
      throw new Error('Only MP4 video files are allowed.');
    }

    const ReadStream = createReadStream();
    //console.log(__dirname);
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

  async findAllVideos(
    page: number = 1,
    perPage: number = 12,
  ): Promise<Video[]> {
    const skip = (page - 1) * perPage;
    return await this.videoModel.find({}).skip(skip).limit(perPage);
  }

  // async findAllVideos(): Promise<Video[]> {
  //   return await this.videoModel.find({});
  // }

  // async findVideos(data: string): Promise<Video[]> {
  //   return await this.videoModel
  //     .find({ $text: { $search: data } }, { score: { $meta: 'textScore' } })
  //     .sort({ score: { $meta: 'textScore' } });
  // }

  async findVideo(
    title: string,
    tags: string,
    page: number = 1,
    perPage: number = 12,
  ): Promise<Video[]> {
    const skip = (page - 1) * perPage;
    try {
      const result = await this.videoModel
        .aggregate([
          {
            $match: {
              title: new RegExp(title, 'i'),
            },
          },
          {
            $unwind: {
              path: '$tags',
              includeArrayIndex: 'index',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              tags: new RegExp(tags, 'i'),
            },
          },
          {
            $project: {
              searchTag: '$tags',
              title: 1,
              _id: 1,
              description: 1,
              video: 1,
              userId: 1,
            },
          },
          {
            $group: {
              _id: '$_id',
              title: { $first: '$title' },
              description: { $first: '$description' },
              userId: { $first: '$userId' },
              searchTag: { $first: '$searchTag' },
              video: { $first: '$video' },
            },
          },
        ])

        .skip(skip)
        .limit(perPage);

      if (result.length === 0) {
        throw new Error('No matching videos found.');
      }

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
}
