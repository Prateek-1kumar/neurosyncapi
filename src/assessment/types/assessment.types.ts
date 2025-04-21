export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type DietaryHabit =
  | 'very-healthy'
  | 'mostly-healthy'
  | 'average'
  | 'unhealthy'
  | 'very-unhealthy';

export type StressLevel = 'none' | 'low' | 'moderate' | 'high' | 'extreme';

export type YesNoAnswer = 'yes' | 'no' | 'prefer-not-to-say';

export interface AssessmentData {
  gender: Gender;
  age: number;
  workPressure: StressLevel;
  jobSatisfaction: number; // 1-10 scale
  sleepDuration: number; // hours
  dietaryHabits: DietaryHabit;
  workHoursPerDay: number;
  financialStressLevel: StressLevel;
  suicidalThoughts: YesNoAnswer;
  familyMentalHealthHistory: YesNoAnswer;
  additionalNotes?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  date: string;
  data: AssessmentData;
  analysis: {
    overallScore: number; // 0-100
    stressScore: number; // 0-100
    wellbeingScore: number; // 0-100
    riskLevel: 'low' | 'moderate' | 'high';
    keyInsights: string[];
    recommendations: string[];
  };
}
