import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('version')
  version(): string {
    return 'v0.1.0';
  }
}
