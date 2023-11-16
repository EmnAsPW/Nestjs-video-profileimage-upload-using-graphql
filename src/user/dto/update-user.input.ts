import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class updateUserInput {
  @Field(() => String, { nullable: true })
  Username: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  confirmPassword: string;

  @Field(() => String, { nullable: true })
  Address: string;

  @Field(() => Number, { nullable: true })
  Age: number;

  @Field(() => String, { nullable: true })
  Bio: string;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;
}

// import { CreateUserInput } from './create-user.input';
// import { InputType, Field, PartialType } from '@nestjs/graphql';
// import { Schema as MongooSchema } from 'mongoose';
// import { IsString, IsEmail } from 'class-validator';

// @InputType()
// export class UpdateUserInput extends PartialType(CreateUserInput) {
//   @Field(() => String)
//   @IsString()
//   _id: MongooSchema.Types.ObjectId;
// }
