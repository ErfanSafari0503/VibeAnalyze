import { Module } from '@nestjs/common';
import { AnalysisService } from './services/analysis.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisProcessor } from './analysis.processor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';
import { TelegramModule } from 'src/telegram/telegram.module';
import { IsValidPlatformConstraint } from 'src/common/validators/is-valid-platform.validator';
import { DataCollectorService } from './services/data-collector.service';
import { DataAnalyzerService } from './services/data-analyzer.service';
import { DuckaiModule } from 'src/duckai/duckai.module';
import { InstagramModule } from 'src/instagram/instagram.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'analysis' }),
    PrismaModule,
    HttpModule,
    InstagramModule,
    TelegramModule,
    DuckaiModule
  ],
  controllers: [AnalysisController],
  providers: [
    AnalysisService,
    AnalysisProcessor,
    DataCollectorService,
    DataAnalyzerService,
    IsValidPlatformConstraint,
  ],
})

export class AnalysisModule { }
