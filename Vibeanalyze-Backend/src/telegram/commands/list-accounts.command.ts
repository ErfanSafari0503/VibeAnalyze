import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { TelegramSessionManagerService } from '../services/telegram-session-manager.service';
import Table from 'cli-table3';

@Injectable()
@Command({
    name: 'telegram:list',
    description: 'List all saved Telegram accounts',
})
export class ListAccountsCommand extends CommandRunner {
    constructor(private readonly sessionManager: TelegramSessionManagerService) {
        super();
    }

    async run(): Promise<void> {
        const chalk = await import('chalk');

        try {

            console.log(chalk.default.blue('📋 Loading Telegram accounts...\n'));

            const accounts = await this.sessionManager.listAccounts();

            if (accounts.length === 0) {
                console.log(chalk.default.yellow('📭 No accounts found.'));
                console.log(chalk.default.gray('Use "bun run start:cli telegram:add" to add a new account.\n'));
                return;
            }

            const table = new Table({
                head: ['TGID', 'Phone', 'First Name', 'Last Name', 'Username', 'Status'].map(h => chalk.default.cyan(h)),
                colWidths: [15, 15, 15, 15, 15, 15],
            });

            accounts.forEach(account => {
                const statusColor = account.status === 'ACTIVE' ? chalk.default.green :
                                  account.status === 'EXPIRED' ? chalk.default.red :
                                  chalk.default.yellow;

                const statusText = account.status === 'ACTIVE' ? '✅ Active' :
                                 account.status === 'EXPIRED' ? '❌ Expired' :
                                 '⚠️ Unknown';

                table.push([
                    account.platformId || 'N/A',
                    account.phone,
                    account.firstName || 'N/A',
                    account.lastName || 'N/A',
                    account.username || 'N/A',
                    statusColor(statusText)
                ]);
            });

            console.log(table.toString());
            console.log(chalk.default.green(`\n✅ Total accounts: ${accounts.length}`));

            const expiredCount = accounts.filter(acc => acc.status === 'EXPIRED').length;
            if (expiredCount > 0) {
                console.log(chalk.default.yellow(`\n⚠️  ${expiredCount} expired sessions found. Use 'bun run start:cli telegram:delete <tgid>' to remove them.`));
            }
        } catch (error) {

            console.error(chalk.default.red('❌ Error listing accounts:'), error.message);
            throw error;
        }
    }
}
