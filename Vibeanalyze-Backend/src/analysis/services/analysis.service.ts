import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnalysisDto } from '../dto/create-analysis.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Analysis, AnalysisStatus, Comment, Post } from '@prisma/client';
import { getPlatform } from 'src/common/utils/platform.util';
import { AnalysisJobData } from '../types/jobs/analysis-job.interface';

@Injectable()
export class AnalysisService {

  constructor(
    @InjectQueue('analysis') private readonly analysisQueue: Queue<AnalysisJobData>,
    private prisma: PrismaService,
  ) { }

  async getAnalysisByIdOrThrow(id: string): Promise<Analysis> {

    const analysis = await this.prisma.analysis.findUnique({
      where: { id }
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis with ID ${id} not found`);
    }

    return analysis;
  }

  async create(createAnalysisDto: CreateAnalysisDto): Promise<Analysis> {

    const post = await this.prisma.post.create({
      data: {
        url: createAnalysisDto.url,
        platform: getPlatform(createAnalysisDto.url),
      }
    });

    const analysis = await this.prisma.analysis.create({
      data: {
        postId: post.id,
        status: AnalysisStatus.PENDING,
      }
    });

    await this.analysisQueue.add('start', {
      analysisId: analysis.id
    });

    return analysis;
  }

  async findOne(id: string): Promise<Analysis> {

    return await this.getAnalysisByIdOrThrow(id);
  }

  async post(id: string): Promise<Post> {

    const analysis = await this.getAnalysisByIdOrThrow(id);

    const post = await this.prisma.post.findUnique({
      where: {
        id: analysis.postId
      }
    });

    return post;
  }

  async comments(id: string): Promise<Comment[]> {

    const analysis = await this.getAnalysisByIdOrThrow(id);

    const comments = await this.prisma.comment.findMany({
      where: {
        postId: analysis.postId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return comments;
  }

  async remove(id: string): Promise<{ message: string }> {

    const analysis = await this.getAnalysisByIdOrThrow(id);

    if ([
      AnalysisStatus.COMPLETED,
      AnalysisStatus.FAILED,
      AnalysisStatus.CANCELLED,
      AnalysisStatus.PAUSED
    ].includes(analysis.status as any)) {
      throw new ForbiddenException('Analysis is not active and cannot be cancelled.');
    }

    await this.prisma.analysis.update({
      data: {
        status: AnalysisStatus.CANCELLED
      },
      where: {
        id: id
      }
    });

    return { message: 'Analysis cancelled successfully' };
  }
}
