import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';
import { TelegramSessionManagerService } from './telegram-session-manager.service';
import * as fs from 'fs';
import * as path from 'path';
import { sleep } from 'src/common/utils/sleep.util';
import { parseTelegramUrl } from 'src/common/utils/platform.util';
import { CommentData, PostData } from 'src/analysis/types/jobs/analysis-data.interface';

@Injectable()
export class TelegramService implements OnModuleDestroy {

  private readonly logger = new Logger(TelegramService.name);
  private client: TelegramClient | null = null;
  private readonly apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
  private readonly apiHash = process.env.TELEGRAM_API_HASH || '';
  private isInitialized = false;

  constructor(private readonly sessionManager: TelegramSessionManagerService) { }

  private async initializeClient() {

    if (this.isInitialized) {
      this.logger.log('Telegram client already initialized');
      return;
    }

    try {

      if (this.apiId === 0 || !this.apiHash) {
        throw new Error('Telegram API credentials not provided');
      }

      // Get random account
      let selectedAccount = await this.sessionManager.getRandomAccount();

      if (!selectedAccount) {
        throw new Error('No Telegram session available. Use telegram CLI to add accounts.');
      }

      const session = new StringSession(selectedAccount.session);
      this.client = new TelegramClient(session, this.apiId, this.apiHash, {});

      await this.client.start({
        phoneNumber: async () => selectedAccount.phone,
        phoneCode: async () => {
          this.logger.warn('Phone code required for Telegram authentication');
          this.logger.warn('Please use "bun run start:cli telegram:add" to manage accounts properly');
          return '';
        },
        password: async () => selectedAccount.password || '',
        onError: (err) => {
          this.logger.error('Telegram authentication error:', err);
        },
      });

      this.isInitialized = true;
      this.logger.log(`Telegram client initialized successfully with account: ${selectedAccount.phone} (${selectedAccount.firstName} ${selectedAccount.lastName})`);
    } catch (error) {
      this.logger.error('Failed to initialize Telegram client:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  async isClientReady(): Promise<boolean> {
    return this.client !== null && this.isInitialized && this.client.connected;
  }

  private async downloadThumbnail(source: Api.Message | Api.Channel | Api.User): Promise<string | null> {

    try {

      const date = Date.now();

      let media = null;
      let fileName = null;

      // Create thumbnails directory
      const thumbnailDir = process.env.THUMBNAIL_DIRECTORY_PATH;

      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      // Download thumbnail
      let buffer: Buffer | null = null;

      // Check if it's a message or entity
      if (source instanceof Api.Message) {

        // It's a message, check for media
        if (!source.media) {
          return null;
        }

        media = source.media;
        fileName = `message_${source.id}_${date}`;

        const thumbs = media.photo?.sizes
          ?? media.document?.thumbs
          ?? media.webpage?.photo?.sizes
          ?? [];

        const largestIndex = thumbs.length != 0 ? thumbs.length - 1 : 0;

        buffer = await this.client.downloadMedia(media, {
          thumb: largestIndex, // Get largest thumbnail available
        }) as Buffer;

      } else if (source instanceof Api.Channel) {

        // It's a channel, check for photo
        if (!source.photo || source.photo instanceof Api.ChatPhotoEmpty) {
          return null;
        }

        media = source.photo;
        fileName = `channel_${source.id}_${date}`;

        buffer = await this.client.downloadProfilePhoto(source, {
          isBig: false, // Get small avatar
        }) as Buffer;

      } else if (source instanceof Api.User) {

        // It's a user, check for photo
        if (!source.photo || source.photo instanceof Api.UserProfilePhotoEmpty) {
          return null;
        }

        media = source.photo;
        fileName = `user_${source.id}_${date}`;

        buffer = await this.client.downloadProfilePhoto(source, {
          isBig: false, // Get small avatar
        }) as Buffer;

      } else {

        return null;
      }

      if (!buffer) {
        return null;
      }

      const finalFileName = `${fileName}.jpg`;
      const filePath = path.join(thumbnailDir, finalFileName);

      // Save file
      fs.writeFileSync(filePath, buffer);

      return finalFileName;

    } catch (error) {
      this.logger.error('Error downloading thumbnail:', error);
      return null;
    }
  }

  /**
   * Extract reactions from message
   */
  private extractReactions(message: Api.Message): Record<string, number> {

    const reactions: Record<string, number> = {};

    if (message.reactions && message.reactions.results) {

      for (const reaction of message.reactions.results) {

        if (reaction.reaction instanceof Api.ReactionEmoji) {
          reactions[reaction.reaction.emoticon] = reaction.count;
        } else if (reaction.reaction instanceof Api.ReactionPaid) {
          reactions[reaction.reaction.className] = reaction.count;
        } else if (reaction.reaction instanceof Api.ReactionCustomEmoji) {
          reactions[reaction.reaction.className] = reaction.count;
        }

      }
    }

    return reactions;
  }

  async getPost(url: string): Promise<PostData> {

    if (await this.isClientReady() === false) {
      await this.initializeClient();
    }

    try {

      const urlInfo = parseTelegramUrl(url);

      if (!urlInfo) {
        throw new Error('Invalid Telegram URL format');
      }

      const { username, messageId } = urlInfo;

      const entity = await this.client.getEntity(username);

      if (!entity || entity instanceof Api.Channel == false) {
        throw new Error('Channel not found');
      }

      const channel = await this.client.invoke(new Api.channels.GetFullChannel({
        channel: entity,
      }));

      if (channel.fullChat instanceof Api.ChannelFull == false) {

        throw new Error('Channel Is not a valid channel');
      }

      // Get the specific message
      const messages = await this.client.getMessages(entity, {
        ids: [messageId]
      });

      if (!messages || messages.length === 0) {
        throw new Error('Message not found');
      }

      const message = messages[0];

      const post: PostData = {
        // Platform-specific IDs
        platformId: message.id.toString(),

        // Content
        title: undefined,
        content: message.message,
        thumbnailPath: await this.downloadThumbnail(message),

        // Author info
        authorPlatformId: entity.id.toString(),
        authorUsername: entity.username,
        authorFullName: entity.title,
        authorAvatarPath: await this.downloadThumbnail(entity),
        authorFollowersCount: channel.fullChat.participantsCount,
        authorVerified: entity.verified,

        // Engagement metrics
        likesCount: undefined,
        commentsCount: message.replies?.replies,
        sharesCount: message.forwards,
        viewsCount: message.views,

        // Post metadata
        reactions: this.extractReactions(message),
        publishedAt: new Date(message.date * 1000),
      };

      return post;

    } catch (error) {
      this.logger.error('Error fetching Telegram post:', error);
      throw new Error(`Failed to fetch Telegram post: ${error.message}`);
    }
  }

  async getComments(url: string): Promise<CommentData[]> {

    if (await this.isClientReady() === false) {
      await this.initializeClient();
    }

    try {

      const urlInfo = parseTelegramUrl(url);

      if (!urlInfo) {
        throw new Error('Invalid Telegram URL format');
      }

      const { username, messageId } = urlInfo;

      const comments: CommentData[] = [];

      // Avatar cache to avoid downloading the same profile photo multiple times
      const avatarCache = new Map<string, string | null>();

      let offsetId = 0;
      let hasMore = true;
      let batchCount = 0;
      const limit = 100;

      while (hasMore) {

        batchCount++;

        try {

          this.logger.log(`Fetching batch ${batchCount} (offset: ${offsetId})`);

          const replies = await this.client.invoke(
            new Api.messages.GetReplies({
              peer: username,
              msgId: messageId,
              offsetId: offsetId,
              limit: limit,
            })
          );

          // Type guard to check if we have messages
          if (!('messages' in replies) || !replies.messages) {

            this.logger.log('No messages in replies result - stopping pagination');
            hasMore = false;
            break;
          }

          const messages = replies.messages;
          const users = replies.users;

          if (messages.length === 0) {

            this.logger.log('No more replies found - stopping pagination');
            hasMore = false;
            break;
          }

          // Create lookup maps for this batch
          const userMap = new Map<string, Api.User>();
          const channelMap = new Map<string, Api.Channel>();

          users.forEach((user) => {
            if (user instanceof Api.User) {
              userMap.set(user.id.toString(), user);
            }
          });

          // Also process chats array if available
          if ('chats' in replies && replies.chats) {

            replies.chats.forEach((chat) => {

              if (chat instanceof Api.Channel) {
                channelMap.set(chat.id.toString(), chat);
              }
            });
          }

          let lastMessageId = offsetId;

          for (const message of messages) {

            if (!(message instanceof Api.Message)) continue;

            lastMessageId = message.id;

            // Get author info based on fromId type
            let authorPlatformId: string | undefined = undefined;
            let authorUsername: string | undefined = undefined;
            let authorFullName: string | undefined = undefined;
            let authorAvatarPath: string | undefined = undefined;
            let authorFollowersCount: number | undefined = undefined;
            let authorVerified: boolean | undefined = undefined;

            if (message.fromId) {

              if (message.fromId instanceof Api.PeerUser) {

                authorPlatformId = message.fromId.userId.toString();
                const user = userMap.get(authorPlatformId);

                if (user) {

                  authorUsername = user.username;
                  authorFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined;
                  authorVerified = user.verified;

                  // Check cache first before downloading avatar
                  const cacheKey = `user_${authorPlatformId}`;
                  if (avatarCache.has(cacheKey)) {
                    authorAvatarPath = avatarCache.get(cacheKey);
                  } else {
                    authorAvatarPath = await this.downloadThumbnail(user);
                    avatarCache.set(cacheKey, authorAvatarPath);
                  }
                }

              } else if (message.fromId instanceof Api.PeerChannel) {

                authorPlatformId = message.fromId.channelId.toString();
                const channel = channelMap.get(authorPlatformId);

                if (channel) {

                  authorUsername = channel.username;
                  authorFullName = channel.title;
                  authorVerified = channel.verified;

                  // Check cache first before downloading avatar
                  const cacheKey = `channel_${authorPlatformId}`;
                  if (avatarCache.has(cacheKey)) {
                    authorAvatarPath = avatarCache.get(cacheKey);
                  } else {
                    authorAvatarPath = await this.downloadThumbnail(channel);
                    avatarCache.set(cacheKey, authorAvatarPath);
                  }

                  // Get followers count for channel
                  try {
                    const fullChannel = await this.client.invoke(new Api.channels.GetFullChannel({
                      channel: channel,
                    }));
                    if (fullChannel.fullChat instanceof Api.ChannelFull) {
                      authorFollowersCount = fullChannel.fullChat.participantsCount;
                    }
                  } catch (error) {
                    this.logger.warn(`Could not get followers count for channel ${authorPlatformId}:`, error.message);
                  }
                }
              }
            } else if (message.peerId) {
              // null fromId - this is an anonymous comment by an admin and we should use peerId
              if (message.peerId instanceof Api.PeerChannel) {

                const channel = channelMap.get(message.peerId.channelId.toString());

                if (channel) {

                  authorPlatformId = channel.id.toString();
                  authorUsername = channel.username;
                  authorFullName = channel.title;
                  authorFollowersCount = channel.participantsCount;
                  authorVerified = channel.verified;

                  // Check cache first before downloading avatar
                  const cacheKey = `channel_${authorPlatformId}`;
                  if (avatarCache.has(cacheKey)) {
                    authorAvatarPath = avatarCache.get(cacheKey);
                  } else {
                    authorAvatarPath = await this.downloadThumbnail(channel);
                    avatarCache.set(cacheKey, authorAvatarPath);
                  }
                }
              }
            }

            // Check if this is a reply to another comment
            const isReply = message.replyTo && message.replyTo.replyToTopId != null && message.replyTo.replyToMsgId != null;
            const parentCommentId = isReply ? message.replyTo.replyToMsgId?.toString() : undefined;

            comments.push({
              // Platform-specific IDs
              platformId: message.id.toString(),

              // Content
              thumbnailPath: await this.downloadThumbnail(message),
              content: message.message,
              isReply: isReply,
              parentPlatformId: parentCommentId,

              // Author info
              authorPlatformId: authorPlatformId,
              authorUsername: authorUsername,
              authorFullName: authorFullName,
              authorAvatarPath: authorAvatarPath,
              authorFollowersCount: authorFollowersCount,
              authorVerified: authorVerified,

              // Engagement
              likesCount: undefined,
              repliesCount: message.replies?.replies,
              sharesCount: message.forwards,
              viewsCount: message.views,

              // Detailed Analytics
              reactions: this.extractReactions(message),

              // Metadata
              publishedAt: new Date(message.date * 1000),
            });
          }

          // Update offset for next batch
          offsetId = lastMessageId;

          // Check if we should continue
          if (messages.length < limit) {

            hasMore = false;
          }

          // Add delay between requests to avoid rate limiting
          if (hasMore) {

            this.logger.log('Waiting 2 seconds before next batch to avoid rate limiting...');
            await sleep(2);
          }

        } catch (error) {

          this.logger.error(`Error fetching batch ${batchCount}:`, error);

          // If it's a rate limit error, wait longer and retry
          if (error.message?.includes('FLOOD_WAIT')) {

            const waitTime = error.message.match(/(\d+)/)?.[1] || '60';
            this.logger.warn(`Rate limited! Waiting ${waitTime} seconds...`);
            await sleep(parseInt(waitTime) + 5);
            continue; // Retry the same batch
          }

          // For other errors, stop pagination
          hasMore = false;
        }
      }

      // Sort comments by date (oldest first)
      comments.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());

      return comments;

    } catch (error) {

      this.logger.error('Could not fetch comments:', error);
      throw new Error(`Failed to fetch Telegram post comments: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.client && this.isInitialized) {
        await this.client.disconnect();
        this.client = null;
        this.isInitialized = false;
        this.logger.log('Telegram client disconnected');
      }
    } catch (error) {
      this.logger.error('Error disconnecting Telegram client:', error);
    }
  }
}
