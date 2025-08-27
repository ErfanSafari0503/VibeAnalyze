import { Injectable, Logger } from '@nestjs/common';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';
import { LogLevel } from 'telegram/extensions/Logger';
import { TelegramAccount } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface SessionManagerConfig {
  apiId: number;
  apiHash: string;
}

@Injectable()
export class TelegramSessionManagerService {

  private readonly logger = new Logger(TelegramSessionManagerService.name);
  private readonly config: SessionManagerConfig;

  constructor(private readonly prisma: PrismaService) {

    this.config = {
      apiId: parseInt(process.env.TELEGRAM_API_ID || '0'),
      apiHash: process.env.TELEGRAM_API_HASH || '',
    };
  }

  /**
   * Load all saved accounts from database
   */
  async getAccounts(): Promise<TelegramAccount[]> {
    try {
      return await this.prisma.telegramAccount.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      this.logger.error('Error loading accounts:', error);
      return [];
    }
  }

  /**
   * Find account by platform_id
   */
  async findAccount(userId: string): Promise<TelegramAccount | null> {
    try {
      return await this.prisma.telegramAccount.findFirst({
        where: {
          platformId: userId
        }
      });
    } catch (error) {
      this.logger.error('Error finding account:', error);
      return null;
    }
  }

  /**
   * Add a new Telegram account
   */
  async addAccount(phoneNumber?: string, password?: string): Promise<TelegramAccount> {

    try {
      if (this.config.apiId === 0 || !this.config.apiHash) {
        throw new Error('Telegram API credentials not configured');
      }

      this.logger.log('Connecting to Telegram...');

      const stringSession = new StringSession();
      const client = new TelegramClient(stringSession, this.config.apiId, this.config.apiHash, {});

      client.setLogLevel(LogLevel.ERROR);

      await client.start({
        phoneNumber: async () => phoneNumber || await input.text("Please enter your phone number: "),
        phoneCode: async () => await input.text("Please enter the code you received: "),
        password: async () => password || await input.text("Please enter your password: "),
        onError: (error) => this.logger.error(`Authentication error: ${error}`),
      });

      client.session.save();
      const session = stringSession.save();
      const user = await client.getMe();

      await client.disconnect();

      // Check if account already exists
      const existingAccount = await this.findAccount(user.id.toString());

      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
      this.logger.log(`Account saved: ${user.id.toString()} (${fullName})`);

      if (existingAccount) {

        // Update existing account
        return await this.prisma.telegramAccount.update({
          where: { id: existingAccount.id },
          data: {
            platformId: user.id.toString(),
            phone: '+' + user.phone,
            firstName: user.firstName || '',
            lastName: user.lastName,
            username: user.username,
            session: session,
            password: password,
            status: 'ACTIVE',
          }
        });
      } else {

        // Create new account
        return await this.prisma.telegramAccount.create({
          data: {
            platformId: user.id.toString(),
            phone: '+' + user.phone,
            firstName: user.firstName || '',
            lastName: user.lastName,
            username: user.username,
            session: session,
            password: password,
            status: 'ACTIVE',
          }
        });
      }
    } catch (error) {
      this.logger.error('Error adding account:', error);
      throw new Error(`Failed to add account: ${error.message}`);
    }
  }

  /**
   * List all saved accounts with validation
   */
  async listAccounts(): Promise<TelegramAccount[]> {

    try {
      const accounts = await this.getAccounts();

      if (accounts.length === 0) {
        return [];
      }

      // Validate accounts by attempting connection
      const validatedAccounts: TelegramAccount[] = [];

      for (const account of accounts) {

        try {

          const stringSession = new StringSession(account.session);
          const client = new TelegramClient(stringSession, this.config.apiId, this.config.apiHash, {});

          client.setLogLevel(LogLevel.ERROR);

          await client.start(null);

          // Test if session is still valid by getting user info
          const user = await client.getMe();

          if (!user || !user.id) {
            throw new Error('Session expired or invalid');
          }

          // Update status to online
          await client.invoke(new Api.account.UpdateStatus({ offline: false }));

          // Update in database
          const updatedAccount = await this.prisma.telegramAccount.update({
            where: { id: account.id },
            data: {
              platformId: user.id.toString(),
              phone: '+' + user.phone,
              firstName: user.firstName || '',
              lastName: user.lastName,
              username: user.username,
              status: 'ACTIVE',
            }
          });

          validatedAccounts.push(updatedAccount);
          await client.disconnect();

          this.logger.log(`Account ${account.phone} validated successfully`);

        } catch (error) {

          this.logger.error(`Account ${account.platformId} (${account.phone}) validation failed: ${error.message}`);

          // Mark account as expired/invalid
          await this.prisma.telegramAccount.update({
            where: { id: account.id },
            data: {
              status: 'EXPIRED'
            }
          });

          validatedAccounts.push({
            ...account,
            status: 'EXPIRED'
          });
        }
      }

      return validatedAccounts;

    } catch (error) {
      this.logger.error('Error listing accounts:', error);
      throw new Error(`Failed to list accounts: ${error.message}`);
    }
  }

  /**
   * Delete an account by ID
   */
  async deleteAccount(userId: string): Promise<void> {

    try {
      const account = await this.findAccount(userId);

      if (!account) {
        throw new Error(`Account with ID "${userId}" not found`);
      }

      // First, logout the session
      try {
        this.logger.log(`Logging out session for account: ${account.phone}`);

        const stringSession = new StringSession(account.session);
        const client = new TelegramClient(stringSession, this.config.apiId, this.config.apiHash, {});

        client.setLogLevel(LogLevel.ERROR);

        await client.start(null);

        // Logout from Telegram
        await client.invoke(new Api.auth.LogOut());
        await client.disconnect();

        this.logger.log('Session logged out successfully');
      } catch (logoutError) {
        this.logger.warn(`Failed to logout session: ${logoutError.message}`);
      }

      // Remove account from database
      await this.prisma.telegramAccount.update({
        where: { id: account.id },
        data: {
          status: 'DELETED'
        },
      });

      this.logger.log(`Account with ID "${userId}" deleted successfully`);

    } catch (error) {
      this.logger.error('Error deleting account:', error);
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }

  /**
   * Refresh session for existing account when session is expired or needs update
   */
  async refreshSession(userId: string): Promise<string> {

    try {
      const account = await this.findAccount(userId);

      if (!account) {
        throw new Error(`Account with ID "${userId}" not found`);
      }

      this.logger.log(`Refreshing session for: ${account.phone} (${account.firstName} ${account.lastName ?? ''})`);

      const stringSession = new StringSession();
      const client = new TelegramClient(stringSession, this.config.apiId, this.config.apiHash, {});

      client.setLogLevel(LogLevel.ERROR);

      await client.start({
        phoneNumber: async () => account.phone,
        phoneCode: async () => {
          // Try to auto-retrieve code from existing session
          let existingClient: TelegramClient | null = null;
          try {
            const existingSession = new StringSession(account.session);
            existingClient = new TelegramClient(existingSession, this.config.apiId, this.config.apiHash, {});

            existingClient.setLogLevel(LogLevel.ERROR);

            await existingClient.start(null);

            const dialogs = await existingClient.getDialogs({ limit: 10 });
            const telegramDialog = dialogs.find(dialog =>
              dialog.entity && dialog.entity.id && dialog.entity.id.toString() === '777000'
            );

            if (telegramDialog) {

              this.logger.log('Checking Telegram service for recent codes...');
              const messages = await existingClient.getMessages(telegramDialog.entity, { limit: 5 });

              for (const message of messages) {

                if (message.message) {

                  const messageAge = Date.now() - (message.date * 1000);

                  // 5 minutes
                  if (messageAge < 300000) {

                    const codeMatch = message.message.match(/\b(\d{5})\b/);

                    if (codeMatch) {

                      this.logger.log(`Found recent verification code: ${codeMatch[1]}`);

                      // Logout old session before returning the code
                      try {
                        this.logger.log('Logging out old session...');
                        await existingClient.invoke(new Api.auth.LogOut());
                      } catch (logoutError) {
                        this.logger.warn(`Failed to logout old session: ${logoutError.message}`);
                      }

                      await existingClient.disconnect();
                      return codeMatch[1];
                    }
                  }
                }
              }
            }

            // If we reach here, logout the old session anyway
            try {
              this.logger.log('Logging out old session...');
              await existingClient.invoke(new Api.auth.LogOut());
            } catch (logoutError) {
              this.logger.warn(`Failed to logout old session: ${logoutError.message}`);
            }

            await existingClient.disconnect();
          } catch (error) {
            this.logger.warn('Could not auto-retrieve code from existing session');
            if (existingClient) {
              try {
                await existingClient.disconnect();
              } catch (disconnectError) {
                // Ignore disconnect errors
              }
            }
          }

          return await input.text("Please enter the verification code: ");
        },
        password: async () => {
          if (account.password) {
            this.logger.log('Using saved password...');
            return account.password;
          }
          return await input.text("Please enter your password: ");
        },
        onError: (error) => this.logger.error(`Authentication error: ${error.message}`),
      });

      client.session.save();
      const newSession = stringSession.save();

      // Get fresh user info and update the account
      const user = await client.getMe();
      await client.disconnect();

      // Update the account with new session and fresh data
      await this.prisma.telegramAccount.update({
        where: { id: account.id },
        data: {
          session: newSession,
          platformId: user.id.toString(),
          phone: '+' + user.phone,
          firstName: user.firstName || '',
          lastName: user.lastName,
          username: user.username,
          status: 'ACTIVE',
        }
      });

      this.logger.log(`Account data updated with new session: ${user.id.toString()} (${user.firstName} ${user.lastName})`);
      this.logger.log('Session refreshed successfully');
      return newSession;

    } catch (error) {
      this.logger.error('Error refreshing session:', error);
      throw new Error(`Failed to refresh session: ${error.message}`);
    }
  }

  /**
   * Check if any accounts exist
   */
  async hasAccounts(): Promise<boolean> {

    const accounts = await this.getAccounts();
    return accounts.length > 0;
  }

  /**
   * Get random available account
   */
  async getRandomAccount(): Promise<TelegramAccount | null> {

    const accounts = await this.getAccounts();

    if (accounts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * accounts.length);

    return accounts[randomIndex];
  }
}
