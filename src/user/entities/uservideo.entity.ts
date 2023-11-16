import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Video } from 'src/video/entities/video.entity';

@ObjectType()
export class UserVideo {
  @Field(() => ID)
  _id?: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  confirmPassword: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  Address: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number })
  Age: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  Bio: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  image?: string;

  @Field(() => [Video], { nullable: true })
  videos?: Video[];
}

export const FindSchema = SchemaFactory.createForClass(UserVideo);
