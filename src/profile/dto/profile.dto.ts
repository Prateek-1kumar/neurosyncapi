import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ description: 'User ID from Firebase Auth' })
  uid: string;

  @ApiProperty({ description: 'User name', required: false })
  name?: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User age', required: false })
  age?: number;

  @ApiProperty({ description: 'User gender', required: false })
  gender?: string;

  @ApiProperty({ description: 'Additional information', required: false })
  additionalInfo?: Record<string, any>;

  @ApiProperty({ description: 'Created date', required: false })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated date', required: false })
  updatedAt?: Date;
}
