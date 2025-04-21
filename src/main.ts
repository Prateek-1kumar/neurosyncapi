import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend access
  app.enableCors();

  // Apply global filters
  app.useGlobalFilters(new DatabaseExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HealthAware API')
    .setDescription('The HealthAware API documentation')
    .setVersion('1.0')
    // Add security definition for JWT bearer token
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Firebase ID token',
        in: 'header',
      },
      'firebase-jwt', // This is a key to identify this security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
