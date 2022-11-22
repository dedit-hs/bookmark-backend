import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class GetUserArgs {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(24, 24)
  _id: string;
}
