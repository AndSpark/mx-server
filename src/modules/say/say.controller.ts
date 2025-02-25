import { Body, Delete, Get, Param, Post } from '@nestjs/common'
import { sample } from 'lodash'
import { SayModel } from './say.model'
import { Auth } from '~/common/decorator/auth.decorator'
import { EventTypes } from '~/processors/gateway/events.types'
import { MongoIdDto } from '~/shared/dto/id.dto'
import { BaseCrudFactory } from '~/transformers/crud-factor.transformer'

export class SayController extends BaseCrudFactory({ model: SayModel }) {
  @Get('/random')
  async getRandomOne() {
    const res = await this.model.find({}).lean()
    if (!res.length) {
      return { data: null }
    }
    return { data: sample(res) }
  }

  @Post('/')
  @Auth()
  async create(@Body() body: Partial<SayModel>) {
    const r = await super.create(body)
    process.nextTick(async () => {
      await this.webgateway.broadcast(EventTypes.SAY_CREATE, r)
    })
    return r
  }

  @Delete('/:id')
  @Auth()
  async delete(@Param() params: MongoIdDto) {
    await super.delete(params)
    process.nextTick(async () => {
      await this.webgateway.broadcast(EventTypes.SAY_DELETE, params.id)
    })
    return 'OK'
  }
}
