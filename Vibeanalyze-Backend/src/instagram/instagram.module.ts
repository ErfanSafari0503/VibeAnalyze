import { Module } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';

@Module({
    imports: [
        PrismaModule,
        PuppeteerModule,
    ],
    providers: [
        InstagramService,
    ],
    exports: [InstagramService],

})

export class InstagramModule { }
