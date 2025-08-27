import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getOnline(): object {
    return {
      success: true,
      code: 200,
      message: 'Online :)',
    };
  }
}
