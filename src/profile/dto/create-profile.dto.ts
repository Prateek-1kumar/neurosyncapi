import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ description: 'User name', required: false })
  name?: string;

  @ApiProperty({ description: 'User email', required: false })
  email?: string;

  @ApiProperty({ description: 'User age', required: false })
  age?: number;

  @ApiProperty({ description: 'User gender', required: false })
  gender?: string;

  @ApiProperty({
    description: 'Additional information',
    required: false,
    example: {
      preferences: { theme: 'dark' },
      settings: { notifications: true },
    },
  })
  additionalInfo?: Record<string, any>;
}
