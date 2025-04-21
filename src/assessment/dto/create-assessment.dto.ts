import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  Gender,
  DietaryHabit,
  StressLevel,
  YesNoAnswer,
} from '../types/assessment.types';

export class CreateAssessmentDto {
  @ApiProperty({
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
    description: 'Gender of the person',
  })
  @IsEnum(
    Object.values({
      male: 'male',
      female: 'female',
      'non-binary': 'non-binary',
      'prefer-not-to-say': 'prefer-not-to-say',
    } as const),
  )
  gender: Gender;

  @ApiProperty({
    minimum: 0,
    maximum: 120,
    description: 'Age of the person',
  })
  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  @ApiProperty({
    enum: ['none', 'low', 'moderate', 'high', 'extreme'],
    description: 'Pressure level at work',
  })
  @IsEnum(
    Object.values({
      none: 'none',
      low: 'low',
      moderate: 'moderate',
      high: 'high',
      extreme: 'extreme',
    } as const),
  )
  workPressure: StressLevel;

  @ApiProperty({
    minimum: 1,
    maximum: 10,
    description: 'Job satisfaction on a scale of 1-10',
  })
  @IsInt()
  @Min(1)
  @Max(10)
  jobSatisfaction: number;

  @ApiProperty({
    minimum: 0,
    maximum: 24,
    description: 'Sleep duration in hours per day',
  })
  @IsInt()
  @Min(0)
  @Max(24)
  sleepDuration: number;

  @ApiProperty({
    enum: [
      'very-healthy',
      'mostly-healthy',
      'average',
      'unhealthy',
      'very-unhealthy',
    ],
    description: 'Dietary habits',
  })
  @IsEnum(
    Object.values({
      'very-healthy': 'very-healthy',
      'mostly-healthy': 'mostly-healthy',
      average: 'average',
      unhealthy: 'unhealthy',
      'very-unhealthy': 'very-unhealthy',
    } as const),
  )
  dietaryHabits: DietaryHabit;

  @ApiProperty({
    minimum: 0,
    maximum: 24,
    description: 'Working hours per day',
  })
  @IsInt()
  @Min(0)
  @Max(24)
  workHoursPerDay: number;

  @ApiProperty({
    enum: ['none', 'low', 'moderate', 'high', 'extreme'],
    description: 'Financial stress level',
  })
  @IsEnum(
    Object.values({
      none: 'none',
      low: 'low',
      moderate: 'moderate',
      high: 'high',
      extreme: 'extreme',
    } as const),
  )
  financialStressLevel: StressLevel;

  @ApiProperty({
    enum: ['yes', 'no', 'prefer-not-to-say'],
    description: 'Whether the person has suicidal thoughts',
  })
  @IsEnum(
    Object.values({
      yes: 'yes',
      no: 'no',
      'prefer-not-to-say': 'prefer-not-to-say',
    } as const),
  )
  suicidalThoughts: YesNoAnswer;

  @ApiProperty({
    enum: ['yes', 'no', 'prefer-not-to-say'],
    description: 'Family history of mental health issues',
  })
  @IsEnum(
    Object.values({
      yes: 'yes',
      no: 'no',
      'prefer-not-to-say': 'prefer-not-to-say',
    } as const),
  )
  familyMentalHealthHistory: YesNoAnswer;

  @ApiProperty({
    required: false,
    description: 'Additional notes or context',
  })
  @IsString()
  @IsOptional()
  additionalNotes?: string;
}
