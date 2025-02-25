import { modelOptions, prop } from '@typegoose/typegoose'
import { IsOptional, IsString } from 'class-validator'
import { BaseModel } from '~/shared/model/base.model'

@modelOptions({
  options: { customName: 'Say' },
})
export class SayModel extends BaseModel {
  @prop({ required: true })
  @IsString()
  text: string

  @prop()
  @IsString()
  @IsOptional()
  source: string

  @prop()
  @IsString()
  @IsOptional()
  author: string
}
