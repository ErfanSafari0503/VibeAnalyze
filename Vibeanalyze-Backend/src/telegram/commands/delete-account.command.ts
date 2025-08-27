import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { TelegramSessionManagerService } from '../services/telegram-session-manager.service';

@Injectable()
@Command({
    name: 'telegram:delete',
    description: 'Delete an account by ID',
    arguments: '<id>',
    argsDescription: {
        id: 'Account ID to delete',
    },
})
export class DeleteAccountCommand extends CommandRunner {
    constructor(private readonly sessionManager: TelegramSessionManagerService) {
        super();
    }

    async run(passedParams: string[]): Promise<void> {
        const chalk = await import('chalk');
        const id = passedParams[0];

    if (!id) {
      console.log(chalk.default.red('❌ Error: Account ID is required'));
      console.log(chalk.default.gray('Usage: bun run start:cli telegram:delete <id>'));
      throw new Error('Account ID is required');
    }

    try {
      console.log(chalk.default.blue(`🗑️  Deleting account with ID: ${id}...`));

      await this.sessionManager.deleteAccount(id);

      console.log(chalk.default.green(`✅ Account with ID ${id} deleted successfully!`));
    } catch (error) {
      console.error(chalk.default.red('❌ Error deleting account:'), error.message);
      throw error;
    }
    }
}
