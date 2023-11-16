import { Field, ObjectType } from '@nestjs/graphql';
import { User, UserFile } from '../../user/entities/user.entity';

@ObjectType()
export class LoginUserResponse {
  @Field(() => UserFile)
  user: UserFile;

  @Field()
  authToken: string;
}
