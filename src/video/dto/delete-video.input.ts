import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { updateVideoDto } from './update-video.input';

@InputType()
export class deleteVideoDto extends PartialType(updateVideoDto) {
  @Field(() => ID)
  _id?: string;
}
