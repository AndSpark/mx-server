import { BadRequestException, Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { MultipartFile } from 'fastify-multipart'
@Injectable()
export class UploadService {
  public async validMultipartField(
    req: FastifyRequest,
  ): Promise<MultipartFile> {
    const data = await req.file()

    if (!data) {
      throw new BadRequestException('仅供上传文件!')
    }
    if (data.fieldname != 'file') {
      throw new BadRequestException('字段必须为 file')
    }

    return data
  }
}
