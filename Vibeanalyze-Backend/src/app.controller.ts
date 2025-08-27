import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is online',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Online :)' }
      }
    }
  })
  getOnline(): object {
    return this.appService.getOnline();
  }
}
