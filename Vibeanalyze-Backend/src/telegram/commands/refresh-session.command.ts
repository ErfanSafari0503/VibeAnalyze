import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { TelegramSessionManagerService } from '../services/telegram-session-manager.service';

@Injectable()
@Command({
  name: 'telegram:refresh',
  description: 'Refresh session for an account (when session is expired or needs update)',
  arguments: '<id>',
  argsDescription: {
    id: 'Account ID',
  },
})
export class RefreshSessionCommand extends CommandRunner {
  constructor(private readonly sessionManager: TelegramSessionManagerService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const chalk = await import('chalk');
    const id = passedParams[0];

    if (!id) {
      console.log(chalk.default.red('❌ Error: Account ID is required'));
      console.log(chalk.default.gray('Usage: bun run start:cli telegram:refresh <id>'));
      throw new Error('Account ID is required');
    }

    try {
      console.log(chalk.default.blue(`🔄 Refreshing session for account ${id}...`));

      const newSession = await this.sessionManager.refreshSession(id);

      console.log(chalk.default.green('✅ Session refreshed successfully!'));
      console.log(chalk.default.blue('\n🔑 New session string:'));
      console.log(chalk.default.white('─'.repeat(80)));
      console.log(chalk.default.white(newSession));
      console.log(chalk.default.white('─'.repeat(80)));
      console.log(chalk.default.yellow('\n💡 You can use this session string in your .env file as:'));
      console.log(chalk.default.gray('TELEGRAM_SESSION="' + newSession + '"'));
      console.log(chalk.default.yellow('\n⚠️  Keep this session string secure and private!'));
      console.log(chalk.default.green('\n🔄 The old session has been logged out automatically.'));
    } catch (error) {
      console.error(chalk.default.red('❌ Error refreshing session:'), error.message);
      throw error;
    }
  }
}
