import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import {
  Gender,
  DietaryHabit,
  StressLevel,
  YesNoAnswer,
} from '../types/assessment.types';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'simple-json' })
  data: {
    gender: Gender;
    age: number;
    workPressure: StressLevel;
    jobSatisfaction: number;
    sleepDuration: number;
    dietaryHabits: DietaryHabit;
    workHoursPerDay: number;
    financialStressLevel: StressLevel;
    suicidalThoughts: YesNoAnswer;
    familyMentalHealthHistory: YesNoAnswer;
    additionalNotes?: string;
  };

  @Column({ type: 'simple-json' })
  analysis: {
    overallScore: number;
    stressScore: number;
    wellbeingScore: number;
    riskLevel: 'low' | 'moderate' | 'high';
    keyInsights: string[];
    recommendations: string[];
  };
}
