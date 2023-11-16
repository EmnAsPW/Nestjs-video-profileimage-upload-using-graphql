import { InputType, Field } from '@nestjs/graphql';
// import {
//   IsEmail,
//   IsString,
//   IsStrongPassword,
//   MaxLength,
//   MinLength,
// } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  Username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;
}
