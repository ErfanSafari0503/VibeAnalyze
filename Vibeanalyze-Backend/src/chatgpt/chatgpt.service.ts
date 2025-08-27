import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatgptService {

    private baseUrl = 'https://chatgpt.com/';
    private userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
    private VQD: string = null;

    constructor(
        private readonly http: HttpService
    ) { }

    async chat(messages: { role: string, content: string }[]) {
        // chatgpt API for future
    }
}
