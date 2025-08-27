import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstagramService } from 'src/instagram/instagram.service';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { Post, PlatformType } from '@prisma/client';
import { CommentData, PostData } from '../types/jobs/analysis-data.interface';

@Injectable()
export class DataCollectorService {

    private readonly logger = new Logger(DataCollectorService.name);
    private post: Post;

    constructor(
        private prisma: PrismaService,
        private instagram: InstagramService,
        private telegram: TelegramService,
    ) { }

    async collectData(post: Post): Promise<void> {

        try {

            this.post = post;

            switch (post.platform) {
                case PlatformType.INSTAGRAM:
                    await this.collectInstagramData(post);
                    break;
                case PlatformType.TELEGRAM:
                    await this.collectTelegramData(post);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${post.platform}`);
            }

        } catch (error) {
            throw new Error(`Data collection failed: ${error.message}`);
        }
    }

    private async saveData(post: PostData, comments: CommentData[]): Promise<void> {

        await this.prisma.post.update({
            where: { id: this.post.id },
            data: { ...post },
        });

        if (comments.length > 0) {

            await this.prisma.comment.createMany({
                data: comments.map(comment => ({
                    postId: this.post.id,
                    ...comment
                }))
            });
        }
    }

    private async collectInstagramData(post: Post): Promise<void> {

        try {

            // #INSTAGRAM_UNAVAILABLE
            // Instagram data is currently unavailable.
            // await this.saveData(
            //     await this.instagram.getPost(post.url),
            //     await this.instagram.getComments(post.url)
            // );

        } catch (error) {
            this.logger.error(`Instagram data collection error: ${error.message}`);
            throw new Error(`Instagram data collection error`);
        }
    }

    private async collectTelegramData(post: Post): Promise<void> {

        try {

            await this.saveData(
                await this.telegram.getPost(post.url),
                await this.telegram.getComments(post.url)
            );

        } catch (error) {
            this.logger.error(`Telegram data collection error: ${error.message}`);
            throw new Error(`Telegram data collection error`);
        }
    }
}
