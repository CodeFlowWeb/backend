import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { SecurityLogger } from './logger/security.logger';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 1 request per ttl
      },
    ]),
    PrismaModule,
    RedisModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    SecurityLogger,
  ],
})
export class AppModule {}
