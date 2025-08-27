import { Module } from '@nestjs/common';
import { DuckaiService } from './duckai.service';
import { HttpModule } from '@nestjs/axios';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';

@Module({
    imports: [
        HttpModule,
        PuppeteerModule
    ],
    providers: [DuckaiService],
    exports: [DuckaiService],
})

export class DuckaiModule { }
