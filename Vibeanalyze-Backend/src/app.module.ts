import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { DuckaiModule } from './duckai/duckai.module';
import { InstagramModule } from './instagram/instagram.module';
import { TelegramModule } from './telegram/telegram.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    DuckaiModule,
    InstagramModule,
    TelegramModule,
    AnalysisModule,
    ChatgptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
