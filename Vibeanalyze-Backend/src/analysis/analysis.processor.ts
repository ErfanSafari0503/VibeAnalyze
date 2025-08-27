
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { Job } from 'bullmq';
import { AnalysisJobData } from './types/jobs/analysis-job.interface';
import { DataAnalyzerService } from './services/data-analyzer.service';
import { DataCollectorService } from './services/data-collector.service';
import { Analysis, AnalysisStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Processor('analysis', {
  concurrency: 3
})
export class AnalysisProcessor extends WorkerHost {

  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    private prisma: PrismaService,
    private dataCollector: DataCollectorService,
    private dataAnalyzer: DataAnalyzerService,
  ) {
    super()
  }

  async process(job: Job<AnalysisJobData, any, string>, token?: string): Promise<any> {

    switch (job.name) {

      case 'start': {

        await this.start(job.data.analysisId);
        break;
      }
    }
  }

  async isAnalysisInactive(id: string): Promise<boolean> {

    const analysis = await this.prisma.analysis.findUnique({
      select: { status: true },
      where: { id: id }
    });

    return (
      analysis.status == AnalysisStatus.CANCELLED ||
      analysis.status == AnalysisStatus.PAUSED ||
      analysis.status == AnalysisStatus.COMPLETED
    );
  }

  async updateAnalysisStatus(id: string, status: AnalysisStatus, description: string = null) {

    let data: Partial<Analysis> = {
      status: status,
      statusDescription: description,
    };

    if (status == AnalysisStatus.COLLECTING_DATA) {
      data.startedAt = new Date();
    } else if (status == AnalysisStatus.COMPLETED) {
      data.finishedAt = new Date();
    }

    return await this.prisma.analysis.update({
      where: { id: id },
      data: data
    });
  }

  private async start(analysisId: string): Promise<void> {

    try {

      const analysis = await this.prisma.analysis.findUnique({
        where: { id: analysisId },
        include: { post: true }
      });

      const post = analysis.post;

      if (!analysis) {
        throw new Error(`Analysis with ID ${analysisId} not found`);
      }

      if (await this.isAnalysisInactive(analysisId)) return;

      await this.updateAnalysisStatus(analysisId, AnalysisStatus.COLLECTING_DATA);

      await this.dataCollector.collectData(post);

      if (await this.isAnalysisInactive(analysisId)) return;

      await this.updateAnalysisStatus(analysisId, AnalysisStatus.ANALYZING_DATA);

      await this.dataAnalyzer.analyzeData(post);

      await this.updateAnalysisStatus(analysisId, AnalysisStatus.COMPLETED);

      this.logger.log(`Analysis ${analysisId} completed successfully.`);

    } catch (error) {

      this.logger.error(`Analysis ${analysisId} failed:`, error);

      await this.updateAnalysisStatus(analysisId, AnalysisStatus.FAILED, error.message);
    }
  }
}
