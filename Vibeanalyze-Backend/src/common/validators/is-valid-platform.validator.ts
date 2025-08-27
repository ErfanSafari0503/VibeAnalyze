import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { getPlatform } from '../utils/platform.util';
import { PlatformType } from '@prisma/client';

@ValidatorConstraint({ async: false })
export class IsValidPlatformConstraint implements ValidatorConstraintInterface {

    private message = 'Unsupported platform. Only Instagram posts and Telegram channel messages are supported.';

    validate(value: any, args: ValidationArguments): boolean {

        if (typeof value !== 'string') {

            return false;
        }

        const url = value.trim().toLowerCase();

        const platform = getPlatform(url);

        if (platform != null) {

            if (platform == PlatformType.INSTAGRAM) {
                // #INSTAGRAM_UNAVAILABLE
                this.message = 'Instagram is currently unavailable';
                return false;
            }

            return true;
        }

        // Additional validation for common mistakes
        if (url.includes('instagram.com')) {
            this.message = 'Invalid Instagram URL format. Please provide a valid post URL (e.g., https://instagram.com/p/ABC123/)';
            return false;
        }

        if (url.includes('t.me') || url.includes('telegram')) {
            this.message = 'Invalid Telegram URL format. Please provide a valid channel message URL (e.g., https://t.me/channel/123)';
            return false;
        }

        return false;
    }

    defaultMessage(args: ValidationArguments): string {
        return this.message;
    }
}

export function IsValidPlatform(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidPlatformConstraint,
        });
    };
}
