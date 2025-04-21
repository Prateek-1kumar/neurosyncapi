import { Injectable } from '@nestjs/common';
import { HelloResponseDto } from './dto/hello.dto';

@Injectable()
export class AppService {
  getHello(): HelloResponseDto {
    return { message: 'Hello World!' };
  }
}
