import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';

@Injectable()
export class DuckaiService {

    private baseUrl = 'https://duckduckgo.com/duckchat/v1';
    private VQD = {
        'x-fe-signals': null,
        'x-fe-version': null,
        'x-vqd-hash-1': null,
    };

    constructor(
        private readonly http: HttpService,
        private readonly puppeteerService: PuppeteerService
    ) { }

    private async generateVQDHash(XVQDHash1: string): Promise<string> {

        const page = await this.puppeteerService.newPage();

        XVQDHash1 = atob(XVQDHash1).replaceAll('webdriver', 'wedbriver');

        const result = await page.evaluate((fnStr) => (new Function(`return ${fnStr};`))(), XVQDHash1);

        return btoa(JSON.stringify({
            ...result,
            client_hashes: await Promise.all(
                result.client_hashes.map(async (hash: string) => {
                    const data = (new TextEncoder()).encode(hash);
                    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                    const hashArray = new Uint8Array(hashBuffer);
                    return btoa(String.fromCharCode(...hashArray));
                })
            ),
            meta: {
                ...result.meta,
                origin: "https://duckduckgo.com",
                stack: "Error\nat b (https://duckduckgo.com/dist/wpm.chat.576c5771a56bc23aac8e.js:1:14240)\nat async https://duckduckgo.com/dist/wpm.chat.576c5771a56bc23aac8e.js:1:16463",
                duration: "17"
            }
        }));
    }

    private generateFEVersion(): string {
        return 'serp_20250711_151537_ET-576c5771a56bc23aac8e';

    }

    private generateFESignals(): string {

        const signals = {
            "start": Date.now(),
            "events": [{
                "name": "onboarding_impression_1",
                "delta": 35
            },
            {
                "name": "onboarding_impression_2",
                "delta": 20921
            },
            {
                "name": "onboarding_finish",
                "delta": 22022
            },
            {
                "name": "startNewChat",
                "delta": 22659
            }],
            "end": 89251
        };

        return btoa(JSON.stringify(signals));
    }

    async updateVQD(): Promise<void> {

        try {
            // Step 1: Get initial VQD from status endpoint
            let response = await this.http.axiosRef.get(`${this.baseUrl}/status`, {
                headers: {
                    "user-agent": this.puppeteerService.userAgent,
                    "x-vqd-accept": "1"
                },
                maxRedirects: 0
            });

            console.log('getting VQD ...');

            if (response.status === 200) {

                this.VQD['x-fe-signals'] = this.generateFESignals();

                this.VQD['x-fe-version'] = this.generateFEVersion();

                this.VQD['x-vqd-hash-1'] = await this.generateVQDHash(response.headers['x-vqd-hash-1']);

                return;
            }

            throw new Error('Failed to get VQD from response headers');

        } catch (error) {
            console.error('Error updating VQD:', error.message);
            throw new Error('Failed to update VQD');
        }
    }

    async chat(messages: { role: string, content: string }[]) {

        // Ensure VQD is updated
        if (!this.VQD['x-vqd-hash-1'] || !this.VQD['x-fe-signals'] || !this.VQD['x-fe-version']) {
            await this.updateVQD();
        }

        console.log(this.VQD);

        // gpt-4o-mini
        // meta-llama/Llama-4-Scout-17B-16E-Instruct
        // claude-3-5-haiku-latest
        // o4-mini
        // mistralai/Mistral-Small-24B-Instruct-2501

        try {

            const response = await this.http.axiosRef.post(`${this.baseUrl}/chat`, {
                model: "gpt-4o-mini",
                messages: messages
            }, {
                headers: {
                    "Accept": "text/event-stream",
                    "Content-Type": "application/json",
                    "User-Agent": this.puppeteerService.userAgent,
                    "Referer": "https://duckduckgo.com/",
                    "Origin": "https://duckduckgo.com",
                    "x-fe-signals": this.VQD['x-fe-signals'],
                    "x-fe-version": this.VQD['x-fe-version'],
                    "x-vqd-hash-1": this.VQD['x-vqd-hash-1'],
                },
                maxRedirects: 0,
                responseType: 'stream',
            });

            if (response.status === 200) {

                this.VQD['x-fe-signals'] = this.generateFESignals();

                this.VQD['x-fe-version'] = this.generateFEVersion();

                this.VQD['x-vqd-hash-1'] = await this.generateVQDHash(response.headers['x-vqd-hash-1']);
            }

            const stream = response.data;

            let responseId = null;
            let responseMessage = '';
            let responseCreated = null;

            for await (const chunk of stream) {

                const chunkStr = chunk.toString().trim();

                if (!chunkStr) continue;

                const lines = chunkStr.split("\n").filter((line: string) => line.trim());

                for (const line of lines) {

                    if (line.startsWith('data: ')) {

                        const data = line.slice(6).trim(); // Remove 'data: ' prefix

                        if (data === '[DONE]') {
                            break;
                        }

                        try {

                            const dataJson = JSON.parse(data);

                            if (dataJson['action'] === 'success') {

                                if (responseId === null) {
                                    responseId = dataJson['id'];
                                }

                                if (dataJson['message']) {
                                    responseMessage += dataJson['message'];
                                }

                                if (responseCreated === null) {
                                    responseCreated = dataJson['created'];
                                }
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse JSON data:', data);
                        }
                    }
                }
            }

            return {
                id: responseId,
                model: "gpt-4o-mini",
                role: "assistant",
                message: responseMessage,
                action: "success",
                created: responseCreated,
            };

        } catch (error) {
            console.error('Chat request failed:', error.message);

            // Try to refresh VQD and retry once
            if (error.response?.status === 403 || error.response?.status === 401) {

                console.log('Refreshing VQD and retrying...');

                await this.updateVQD();

                return this.chat(messages);
            }

            throw new Error(`DuckAI chat failed: ${error.message}`);
        }
    }
}
