import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class PuppeteerService implements OnModuleDestroy {

    private readonly logger = new Logger(PuppeteerService.name);

    private width = 1024;
    private height = 850;

    readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    private browser: Browser | null = null;

    private readonly puppeteerUserDataPath = process.env.PUPPETEER_USER_DATA_DIRECTORY_PATH;

    private isInitialized = false;

    private async initializeBrowser() {

        if (this.isInitialized) {
            this.logger.log('Browser already initialized');
            return;
        }

        try {
            this.browser = await puppeteer.launch({
                headless: true,
                userDataDir: this.puppeteerUserDataPath,
                args: [
                    `--window-size=${this.width},${this.height}`,
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });

            this.isInitialized = true;
            this.logger.log(`Browser initialized successfully`);
        } catch (error) {
            this.logger.error('Failed to initialize browser:', error);
            this.isInitialized = false;
            throw error;
        }
    }

    async newPage(): Promise<Page> {

        if (this.browser == null || this.isInitialized == false) {
            await this.initializeBrowser();
        }

        try {

            const page = await this.browser.newPage();

            await page.setUserAgent(this.userAgent);

            await page.setViewport({
                width: this.width,
                height: this.height,
            });

            return page;
        } catch (error) {
            this.logger.error('Error creating new page:', error);
        }
    }

    async onModuleDestroy() {
        try {
            if (this.browser && this.isInitialized) {
                await this.browser.close();
                this.browser = null;
                this.isInitialized = false;
                this.logger.log('Browser disconnected');
            }
        } catch (error) {
            this.logger.error('Error disconnecting browser:', error);
        }
    }

}
