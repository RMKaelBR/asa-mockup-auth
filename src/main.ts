import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SqlDataSource from './data-source';

async function bootstrap() {
  await SqlDataSource.initialize();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001', 'https://asa-mockup.vercel.app'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: 'Content-Type',
    credentials: true,
  })
  await app.listen(3000);
}
bootstrap();
