import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { ProductEntity } from './products/dto/product.entity';
import { ProductsModule } from './products/products.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: [ProductEntity],
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: true,
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
