import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT ?? '5432', 10),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
