import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class LoginUserRES {
  @Field(() => ID)
  _id?: string;
}
