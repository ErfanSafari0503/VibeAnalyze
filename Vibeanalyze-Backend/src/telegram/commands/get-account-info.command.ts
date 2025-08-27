import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { TelegramSessionManagerService } from '../services/telegram-session-manager.service';

@Injectable()
@Command({
  name: 'telegram:info',
  description: 'Get account information by ID',
  arguments: '<id>',
  argsDescription: {
    id: 'Account ID',
  },
})
export class GetAccountInfoCommand extends CommandRunner {
  constructor(private readonly sessionManager: TelegramSessionManagerService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const chalk = await import('chalk');
    const id = passedParams[0];

    if (!id) {
      console.log(chalk.default.red('❌ Error: Account ID is required'));
      console.log(chalk.default.gray('Usage: bun run start:cli telegram:info <id>'));
      throw new Error('Account ID is required');
    }

    try {
      console.log(chalk.default.blue(`ℹ️  Getting account info for ID: ${id}...`));

      const account = await this.sessionManager.findAccount(id);

      if (!account) {
        console.log(chalk.default.red(`❌ Error: Account with ID "${id}" not found`));
        throw new Error(`Account with ID "${id}" not found`);
      }

      console.log(chalk.default.green('\n✅ Account Information:'));
      console.log(chalk.default.cyan(`🆔 TGID: ${account.platformId}`));
      console.log(chalk.default.cyan(`📞 Phone: ${account.phone}`));
      console.log(chalk.default.cyan(`👤 Name: ${account.firstName} ${account.lastName ?? ''}`));
      console.log(chalk.default.cyan(`🏷️  Username: ${account.username || 'N/A'}`));
      console.log(chalk.default.cyan(`🔑 Has Session: ${account.session ? 'Yes' : 'No'}`));
      console.log(chalk.default.cyan(`🔐 Has Password: ${account.password ? 'Yes' : 'No'}`));

      const statusColor = (account.status || 'unknown') === 'ACTIVE' ? chalk.default.green :
        (account.status || 'unknown') === 'EXPIRED' ? chalk.default.red :
          chalk.default.yellow;
      const statusText = (account.status || 'unknown') === 'ACTIVE' ? '✅ Active' :
        (account.status || 'unknown') === 'EXPIRED' ? '❌ Expired' :
          '⚠️ Unknown';
      console.log(chalk.default.cyan(`🔄 Status: ${statusColor(statusText)}`));

      if ((account.status || 'unknown') === 'EXPIRED') {
        console.log(chalk.default.yellow('\n💡 Tip: Use "bun run start:cli telegram:refresh <id>" to refresh this session.'));
      }
    } catch (error) {
      console.error(chalk.default.red('❌ Error getting account info:'), error.message);
      throw error;
    }
  }
}
