import { Comment, Post } from "@prisma/client";

export interface PostData extends Omit<Post,
    'id' |
    'url' |
    'platform' |
    'updatedAt' |
    'createdAt'
> { }

export interface CommentData extends Omit<Comment,
    'id' |
    'postId' |
    'language' |
    'sentimentType' |
    'sentimentScore' |
    'confidenceLevel' |
    'emotionScores' |
    'topics' |
    'keywords' |
    'rating' |
    'satisfactionScore' |
    'liked' |
    'tone' |
    'overallSentimentScore' |
    'positiveSentences' |
    'additionalInsights' |
    'personalityTraits' |
    'processedAt' |
    'updatedAt' |
    'createdAt'
> { }
