import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { HttpCacheInterceptor } from './common/interceptors/cache.interceptor'
import { CountingInterceptor } from './common/interceptors/counting.interceptor'
import {
  JSONSerializeInterceptor,
  ResponseInterceptor,
} from './common/interceptors/response.interceptors'
import { AnalyzeMiddleware } from './common/middlewares/analyze.middleware'
import { SkipBrowserDefaultRequestMiddleware } from './common/middlewares/favicon.middleware'
import { SecurityMiddleware } from './common/middlewares/security.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { CategoryModule } from './modules/category/category.module'
import { CommentModule } from './modules/comment/comment.module'
import { ConfigsModule } from './modules/configs/configs.module'
import { InitModule } from './modules/init/init.module'
import { PostModule } from './modules/post/post.module'
import { UserModule } from './modules/user/user.module'
import { CacheModule } from './processors/cache/cache.module'
import { DbModule } from './processors/database/database.module'
import { GatewayModule } from './processors/gateway/gateway.module'
import { HelperModule } from './processors/helper/helper.module'

@Module({
  imports: [
    DbModule,
    CacheModule,
    ConfigModule.forRoot({
      envFilePath: [
        '.env.development.local',
        '.env.development',
        '.env.production.local',
        '.env.production',
        '.env',
      ],
      isGlobal: true,
    }),

    InitModule,
    UserModule,
    PostModule,
    CategoryModule,
    AuthModule,
    UserModule,
    CommentModule,
    ConfigsModule,

    GatewayModule,
    HelperModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JSONSerializeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CountingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AnalyzeMiddleware)
      .forRoutes({ path: '(.*?)', method: RequestMethod.GET })
      .apply(SkipBrowserDefaultRequestMiddleware, SecurityMiddleware)
      .forRoutes({ path: '(.*?)', method: RequestMethod.ALL })
  }
}
