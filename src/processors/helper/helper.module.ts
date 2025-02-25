import { Global, Module, Provider, forwardRef } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { AssetService } from './helper.asset.service'
import { CountingService } from './helper.counting.service'
import { CronService } from './helper.cron.service'
import { EmailService } from './helper.email.service'
import { HttpService } from './helper.http.service'
import { ImageService } from './helper.image.service'
import { TaskQueueService } from './helper.tq.service'
import { UploadService } from './helper.upload.service'
import { SearchModule } from '~/modules/search/search.module'
import { PostModule } from '~/modules/post/post.module'
import { PageModule } from '~/modules/page/page.module'
import { NoteModule } from '~/modules/note/note.module'
import { BackupModule } from '~/modules/backup/backup.module'
import { AggregateModule } from '~/modules/aggregate/aggregate.module'

const providers: Provider<any>[] = [
  HttpService,
  EmailService,
  ImageService,
  CronService,
  CountingService,
  UploadService,
  AssetService,
  TaskQueueService,
]

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: isDev,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),

    forwardRef(() => AggregateModule),
    forwardRef(() => PostModule),
    forwardRef(() => NoteModule),
    forwardRef(() => PageModule),
    forwardRef(() => SearchModule),
    forwardRef(() => BackupModule),
  ],
  providers,
  exports: providers,
})
@Global()
export class HelperModule {}
