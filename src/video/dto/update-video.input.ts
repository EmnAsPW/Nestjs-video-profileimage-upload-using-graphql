import { CreateVideoDto } from './create-video.input';
//import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
//import { CreateUserInput } from './create-user.input';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
@InputType()
export class updateVideoDto {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  video?: FileUpload | string;
}
