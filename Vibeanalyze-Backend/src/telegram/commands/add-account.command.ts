import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { TelegramSessionManagerService } from '../services/telegram-session-manager.service';

@Injectable()
@Command({
  name: 'telegram:add',
  description: 'Add a new Telegram account',
})
export class AddAccountCommand extends CommandRunner {
  constructor(private readonly sessionManager: TelegramSessionManagerService) {
    super();
  }

  async run(): Promise<void> {
    const chalk = await import('chalk');

    try {
      console.log(chalk.default.blue('📱 Adding new Telegram account...'));
      console.log(chalk.default.gray('Please follow the prompts to add your account.\n'));

      const account = await this.sessionManager.addAccount();

      console.log(chalk.default.green('\n✅ Account added successfully!'));
      console.log(chalk.default.blue(`Account: ${account.firstName} ${account.lastName ?? ''} (${account.phone})`));
      console.log(chalk.default.blue('You can now use this account for Telegram operations.'));
    } catch (error) {
      console.error(chalk.default.red('❌ Error adding account:'), error.message);
      throw error;
    }
  }
}
