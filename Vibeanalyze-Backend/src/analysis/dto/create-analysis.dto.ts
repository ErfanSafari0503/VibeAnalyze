import { IsNotEmpty, IsString, IsUrl, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsValidPlatform } from "src/common/validators/is-valid-platform.validator";

export class CreateAnalysisDto {

    @ApiProperty({
        description: 'URL of the Instagram post or Telegram channel/group to analyze',
        example: 'https://www.instagram.com/p/ABC123/',
        pattern: '(https://www.instagram.com/.*|https://(t|telegram).me/.*|https://telegram.dog/.*)'
    })
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    @IsValidPlatform()
    url: string;
}
