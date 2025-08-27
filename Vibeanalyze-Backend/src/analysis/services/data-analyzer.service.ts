import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DuckaiService } from 'src/duckai/duckai.service';
import ollama from 'ollama';
import { ANALYZE_COMMENT_PROMPT } from 'constants/prompts';
import { extractJsonFromText } from 'src/common/utils/json.util';
import { Analysis, Post, Comment, Prisma } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class DataAnalyzerService {

    private readonly logger = new Logger(DataAnalyzerService.name);

    constructor(
        private prisma: PrismaService,
        private duckai: DuckaiService,
    ) { }

    async analyzeData(post: Post): Promise<void> {

        try {

            const comments = await this.prisma.comment.findMany({
                where: {
                    postId: post.id,
                    processedAt: null
                },
                orderBy: { createdAt: 'asc' }
            });

            if (process.env.ANALYZE_AI_PROVIDER === 'OLLAMA') {
                await this.handleWithLocalOllama(comments);
            } else if (process.env.ANALYZE_AI_PROVIDER === 'GEMINI') {
                await this.handleWithGemeni(comments);
            } else if (process.env.ANALYZE_AI_PROVIDER === 'DUCKAI') {
                await this.handleWithDuckAi(comments);
            } else {
                throw new Error(`Unsupported AI provider: ${process.env.ANALYZE_AI_PROVIDER}`);
            }

        } catch (error) {
            throw new Error(`Data analysis failed: ${error.message}`);
        }
    }

    private fixText(text: string): string {
        return text
            .trim()
            .replace(/"/g, `\"`)
            .replace(/\n{4,}/g, "\n\n\n")
            .replace(/\n{2,}/g, "\n")
            .replace(/[ ]{3,}/g, "  ")
            .replace(/\t+/g, " ")
            .replace(/[^\S\r\n]{2,}/g, " ")
            .replace(/\s+\n/g, "\n")
            .replace(/\n\s+/g, "\n");
    }

    private mapCommentToAiInput(comment: Comment): string {

        return JSON.stringify({
            id: comment.id,
            platformId: comment.platformId,
            content: this.fixText(comment.content),
            isReply: comment.isReply,
            parentPlatformId: comment.parentPlatformId,

            authorUsername: comment.authorUsername,
            authorFullName: this.fixText(comment.authorFullName),
            authorFollowersCount: comment.authorFollowersCount,
            authorVerified: comment.authorVerified,

            likesCount: comment.likesCount,
            repliesCount: comment.repliesCount,
            sharesCount: comment.sharesCount,
            viewsCount: comment.viewsCount,

            reactions: comment.reactions,

            publishedAt: comment.publishedAt,
        });
    }

    private chunkCommentsForAnalysis(comments: Comment[], maxChunkLength = 6000): string[] {

        const chunks: string[] = [];

        let currentChunk: string[] = [];
        let currentLength = 2; // 2 for [ and ]

        for (const comment of comments) {

            const analysisInput = this.mapCommentToAiInput(comment);
            const analysisInputLength = analysisInput.length + 1; // +1 for comma between items

            if (currentLength + analysisInputLength > maxChunkLength) {
                // save current chunk
                chunks.push(`[${currentChunk.join(',')}]`);
                // reset
                currentChunk = [analysisInput];
                currentLength = analysisInputLength;
            } else {
                currentChunk.push(analysisInput);
                currentLength += analysisInputLength;
            }
        }

        // add last chunk if not empty
        if (currentChunk.length > 0) {
            chunks.push(`[${currentChunk.join(',')}]`);
        }

        return chunks;
    }

    private async updateCommentsAnalysis(comments: Comment[], commentsAnalysis: any[]): Promise<void> {

        const BATCH_SIZE = 300;

        let updatePromises: Prisma.PrismaPromise<Prisma.BatchPayload>[] = [];

        for (const [index, commentResponse] of commentsAnalysis.entries()) {

            if (commentResponse && commentResponse['id']) {

                const comment = comments.find(c => c.id == commentResponse['id']);

                if (comment) {

                    updatePromises.push(
                        this.prisma.comment.updateMany({
                            where: { id: comment.id },
                            data: {
                                language: commentResponse['language'] ?? null,
                                sentimentType: commentResponse['sentiment_type'] ?? null,
                                sentimentScore: commentResponse['sentiment_score'] ?? null,
                                confidenceLevel: commentResponse['confidence_level'] ?? null,
                                emotionScores: commentResponse['emotion_scores'] ?? null,
                                topics: commentResponse['topics'] ?? [],
                                keywords: commentResponse['keywords'] ?? [],
                                rating: commentResponse['rating'] ?? null,
                                satisfactionScore: commentResponse['satisfaction_score'] ?? null,
                                liked: commentResponse['liked'] ?? null,
                                tone: commentResponse['tone'] ?? null,
                                overallSentimentScore: commentResponse['overall_sentiment_score'] ?? null,
                                positiveSentences: commentResponse['positive_sentences'] ?? null,
                                additionalInsights: commentResponse['additional_insights'] ?? null,
                                personalityTraits: commentResponse['personality_traits'] ?? null,
                                processedAt: new Date(),
                            },
                        })
                    );
                }
            }

            if ((index + 1) % BATCH_SIZE === 0) {
                await Promise.all(updatePromises);
                updatePromises = [];
            }
        }

        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
        }
    }

    private async processChunksWithProvider<T>(
        provider: string,
        chunks: string[],
        processChunk: (chunk: string, index: number) => Promise<T[]>
    ): Promise<T[]> {

        const responses: T[][] = [];

        for (const [index, chunk] of chunks.entries()) {

            const startTime = Date.now();

            try {

                const response = await processChunk(chunk, index);
                const endTime = Date.now();
                const duration = endTime - startTime;

                const currentChunk = index + 1;
                const progressPercentage = Math.round((currentChunk / chunks.length) * 100);

                this.logger.log(
                    `${provider} API call completed - Progress: ${currentChunk}/${chunks.length} (${progressPercentage}%) - Chunk size: ${chunk.length} chars, Duration: ${duration}ms`
                );

                responses.push(response);

            } catch (error) {
                this.logger.error(`${provider} chunk ${index + 1} failed: ${error.message}`);
                throw error;
            }
        }

        return responses.flat();
    }

    private async handleWithLocalOllama(comments: Comment[]): Promise<void> {

        try {

            const chunks = this.chunkCommentsForAnalysis(comments, 1000);

            const responses = await this.processChunksWithProvider(
                'Ollama',
                chunks,
                async (chunk: string) => {

                    console.log('asasasas');

                    const response = await ollama.chat({
                        model: process.env.OLLAMA_MODEL,
                        messages: [
                            { role: 'system', content: ANALYZE_COMMENT_PROMPT },
                            { role: 'user', content: chunk },
                        ],
                    });

                    return extractJsonFromText(response.message.content) as object[];
                }
            );

            await this.updateCommentsAnalysis(comments, responses);

        } catch (error) {
            this.logger.error(`Ollama analysis error: ${error.message}`);
            throw new Error(`analysis error`);
        }
    }

    private async handleWithDuckAi(comments: Comment[]): Promise<void> {

        try {

            const chunks = this.chunkCommentsForAnalysis(comments, 2000);

            const responses = await this.processChunksWithProvider(
                'DuckAI',
                chunks,
                async (chunk: string) => {

                    const response = await this.duckai.chat([{
                        role: 'user',
                        content: `${ANALYZE_COMMENT_PROMPT}\nComments:\n${chunk}`
                    }]);

                    return extractJsonFromText(response.message) as object[];
                }
            );

            await this.updateCommentsAnalysis(comments, responses);

        } catch (error) {
            this.logger.error(`DuckAI analysis error: ${error.message}`);
            throw new Error(`analysis error`);
        }
    }

    private async handleWithGemeni(comments: Comment[]): Promise<void> {

        try {

            const ai = new GoogleGenAI({});

            const chunks = this.chunkCommentsForAnalysis(comments, 6000);

            const responses = await this.processChunksWithProvider(
                'Gemini',
                chunks,
                async (chunk: string) => {
                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: `${ANALYZE_COMMENT_PROMPT}\nComments:\n${chunk}`,
                    });

                    return extractJsonFromText(response.text) as object[];
                }
            );

            await this.updateCommentsAnalysis(comments, responses);

        } catch (error) {
            this.logger.error(`Gemini analysis error: ${error.message}`);
            throw new Error(`analysis error`);
        }
    }
}
