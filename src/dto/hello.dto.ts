import { ApiProperty } from '@nestjs/swagger';

export class HelloResponseDto {
  @ApiProperty({
    description: 'The hello message',
    example: 'Hello World!',
  })
  message: string;
}
