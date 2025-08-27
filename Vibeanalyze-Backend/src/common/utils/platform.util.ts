import { PlatformType } from "@prisma/client";

export const parseInstagramUrl = (url: string): { code: string } | null => {
    try {
        /**
         * Support formats:
         * https://www.instagram.com/p/ABC123/
         */

        const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p)\/([^\/\?]+)\/?/;
        const match = url.match(regex);

        if (!match) {
            return null;
        }

        const code = match[1];

        return { code };
    } catch (error) {
        return null;
    }
}

export const parseTelegramUrl = (url: string): { username: string; messageId: number } | null => {
    try {
        /**
         * Support formats:
         * https://t.me/channel/123
         * https://t.me/channel/123?comment=456
         * https://telegram.me/channel/123
         * https://telegram.dog/channel/123
         */

        const regex = /(?:https?:\/\/)?(?:t\.me|telegram\.me|telegram\.dog)\/([^\/\?]+)\/(\d+)/;
        const match = url.match(regex);

        if (!match) {
            return null;
        }

        const username = match[1];
        const messageId = parseInt(match[2]);

        return { username, messageId };
    } catch (error) {
        return null;
    }
}

export const getPlatform = (url: string): PlatformType | null => {

    if (parseInstagramUrl(url) != null) {
        return PlatformType.INSTAGRAM;
    }

    if (parseTelegramUrl(url) != null) {
        return PlatformType.TELEGRAM;
    }

    return null;
}