import { ApiProperty } from '@nestjs/swagger';
import { AssessmentData } from '../types/assessment.types';

export class AssessmentResponseDto {
  @ApiProperty({ description: 'Unique identifier for the assessment' })
  id: string;

  @ApiProperty({ description: 'User ID associated with the assessment' })
  userId: string;

  @ApiProperty({ description: 'Date when assessment was created' })
  date: string;

  @ApiProperty({
    description: 'Assessment input data',
  })
  data: AssessmentData;

  @ApiProperty({
    description: 'AI analysis of the assessment data',
    example: {
      overallScore: 75,
      stressScore: 60,
      wellbeingScore: 80,
      riskLevel: 'low',
      keyInsights: [
        'Good job satisfaction contributes positively to mental health',
        'Sleep duration is within healthy range',
        'Financial stress could be affecting wellbeing',
      ],
      recommendations: [
        'Practice daily mindfulness for 10 minutes',
        'Consider consulting a financial advisor for stress reduction',
        'Maintain regular sleep schedule',
        'Incorporate 30 minutes of exercise daily',
      ],
    },
  })
  analysis: {
    overallScore: number;
    stressScore: number;
    wellbeingScore: number;
    riskLevel: 'low' | 'moderate' | 'high';
    keyInsights: string[];
    recommendations: string[];
  };
}
