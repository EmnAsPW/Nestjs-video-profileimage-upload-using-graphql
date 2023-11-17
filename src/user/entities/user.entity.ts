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
  @Field(() => ID)
  // @Prop(() => String)  //No need Always
  _id?: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  Username: string;

  @Field(() => String)
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Field(() => String)
  @Prop({ required: true })
  password: string;

  @Field(() => String)
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
  @Field(() => String)
  _id: string;

  // Add user properties
  @Field(() => String)
  @Prop()
  Username: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;
}

@ObjectType()
@Schema()
export class UserDetails {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @Prop()
  Username: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;
}

@ObjectType()
export class LoginUserResponseR {
  @Field(() => User)
  user: User;

  @Field(() => String)
  authToken: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// import { ObjectType, Field } from '@nestjs/graphql';
// import { Document, Schema as MongooSchema } from 'mongoose';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// // import { Book } from '../../book/entities/book.entity';

// @ObjectType()
// @Schema()
// export class User {
//   @Field(() => String)
//   _id: MongooSchema.Types.ObjectId;

//   @Field(() => String)
//   @Prop()
//   username: string;

//   @Field(() => String)
//   @Prop({ unique: true })
//   email: string;

//   @Field(() => String)
//   @Prop()
//   password: string;

//   @Field(() => String)
//   @Prop()
//   Confirm_password: string;
// }
