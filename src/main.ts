import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips props not defined in DTOs
      forbidNonWhitelisted: true, // Throws error if non-whitelisted props are present
      transform: true, // Automatically transform payloads
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS with strict configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable helmet with enhanced security and additional headers
  await app.register(require('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        scriptSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'https:'],
        connectSrc: [`'self'`],
        fontSrc: [`'self'`],
        objectSrc: [`'none'`],
        mediaSrc: [`'self'`],
        frameSrc: [`'none'`],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
    noSniff: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
  });
  // Enable compression
  app.register(require('@fastify/compress'), {
    global: true, // Apply compression globally
    threshold: 1024, // Compress responses larger than 1KB
    // You can also specify other options like `br` or `gzip` for specific encodings
    // encoding: ['gzip', 'br'],
  });

  await app.listen(process.env.PORT ?? 4200, '0.0.0.0');
}
bootstrap();
