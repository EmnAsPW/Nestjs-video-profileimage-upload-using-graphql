import { Video } from './../../video/entities/video.entity';
import { UserVideo } from './uservideo.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document, Types } from 'mongoose';

//export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User {
  @Field(() => ID, { nullable: true })
  // @Prop(() => String)  //No need Always
  _id?: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  Username: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  password: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  confirmPassword: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  Address: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  Age: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  Bio: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  image?: string;
}

@ObjectType()
@Schema()
export class UserFile {
  @Field(() => String, { nullable: true })
  _id: string;

  // Add user properties
  @Field(() => String, { nullable: true })
  @Prop()
  Username: string;

  @Field(() => String, { nullable: true })
  @Prop({ unique: true })
  email: string;
}

@ObjectType()
@Schema()
export class UserDetails {
  @Field(() => String, { nullable: true })
  _id: string;

  @Field(() => String, { nullable: true })
  @Prop()
  Username: string;

  @Field(() => String, { nullable: true })
  @Prop({ unique: true })
  email: string;
}

@ObjectType()
export class LoginUserResponseR {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => String, { nullable: true })
  authToken: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
