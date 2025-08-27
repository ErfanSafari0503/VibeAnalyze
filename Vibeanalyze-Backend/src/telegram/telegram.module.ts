import { Module } from '@nestjs/common';
import { TelegramService } from './services/telegram.service';
import { TelegramSessionManagerService } from './services/telegram-session-manager.service';
import { ListAccountsCommand } from './commands/list-accounts.command';
import { AddAccountCommand } from './commands/add-account.command';
import { DeleteAccountCommand } from './commands/delete-account.command';
import { GetAccountInfoCommand } from './commands/get-account-info.command';
import { RefreshSessionCommand } from './commands/refresh-session.command';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    TelegramService,
    TelegramSessionManagerService,
    ListAccountsCommand,
    AddAccountCommand,
    DeleteAccountCommand,
    GetAccountInfoCommand,
    RefreshSessionCommand,
  ],
  exports: [TelegramService, TelegramSessionManagerService],
})

export class TelegramModule {}
