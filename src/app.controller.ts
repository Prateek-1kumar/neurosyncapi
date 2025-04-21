import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HelloResponseDto } from './dto/hello.dto';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a hello message',
    type: HelloResponseDto,
  })
  getHello(): HelloResponseDto {
    return this.appService.getHello();
  }
}
