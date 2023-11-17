import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class VideoInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  tags: string;
}
