import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Get()
  async healthCheck() {
    const cacheKey = 'health_status';
    const cachedData = await this.redis.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      // Execute a simple query to check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      const response = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };

      await this.redis.set(cacheKey, response, 60); // 60 seconds TTL
      return response;
    } catch (error) {
      const response = {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      };

      await this.redis.set(cacheKey, response, 60);
      return response;
    }
  }
}
