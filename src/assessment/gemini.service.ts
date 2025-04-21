import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssessmentData } from './types/assessment.types';

@Injectable()
export class GeminiService {
  private readonly generativeAI: GoogleGenerativeAI;
  private readonly model: any;
  private readonly logger = new Logger(GeminiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.error('Gemini API key not found in environment variables');
    }

    this.generativeAI = new GoogleGenerativeAI(apiKey);
    this.model = this.generativeAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
    });
  }

  async analyzeAssessmentData(
    assessmentData: AssessmentData,
    userId: string,
  ): Promise<any> {
    try {
      const prompt = this.buildPrompt(assessmentData);
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse response
      return this.parseGeminiResponse(text, assessmentData, userId);
    } catch (error) {
      this.logger.error(
        `Error analyzing assessment data: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private buildPrompt(data: AssessmentData): string {
    return `
    You are a mental health assessment AI. Based on the following data about a person, provide an analysis of their mental health status.
    
    The analysis must strictly include the following fields in valid JSON format:
    - overallScore: A number from 0-100 representing overall mental health (higher is better)
    - stressScore: A number from 0-100 representing stress level (higher means more stress)
    - wellbeingScore: A number from 0-100 representing well-being (higher is better)
    - riskLevel: One of "low", "moderate", or "high" representing overall risk level
    - keyInsights: An array of 3-5 strings with key observations about the person's mental health
    - recommendations: An array of 3-5 practical recommendations for improving mental health
    
    The response should be in valid JSON format only (no markdown, no additional text).
    
    User data:
    - Gender: ${data.gender}
    - Age: ${data.age}
    - Work pressure: ${data.workPressure}
    - Job satisfaction (1-10): ${data.jobSatisfaction}
    - Sleep duration (hours): ${data.sleepDuration}
    - Dietary habits: ${data.dietaryHabits}
    - Work hours per day: ${data.workHoursPerDay}
    - Financial stress level: ${data.financialStressLevel}
    - Suicidal thoughts: ${data.suicidalThoughts}
    - Family mental health history: ${data.familyMentalHealthHistory}
    - Additional notes: ${data.additionalNotes || 'None provided'}
    
    Important considerations:
    - Higher risk should be assigned if suicidal thoughts are present, sleep is less than 6 hours, or stress levels are extreme
    - Consider age when evaluating risk factors
    - Provide actionable, specific recommendations
    
    Respond with valid JSON only.
    `;
  }

  private parseGeminiResponse(
    responseText: string,
    assessmentData: AssessmentData,
    userId: string,
  ): any {
    try {
      // Find JSON in response text
      let jsonStr = responseText;

      // Handle if the response contains markdown code blocks
      if (responseText.includes('```json')) {
        const startIndex = responseText.indexOf('```json') + 7;
        const endIndex = responseText.lastIndexOf('```');
        if (endIndex > startIndex) {
          jsonStr = responseText.substring(startIndex, endIndex).trim();
        }
      } else if (responseText.includes('```')) {
        const startIndex = responseText.indexOf('```') + 3;
        const endIndex = responseText.lastIndexOf('```');
        if (endIndex > startIndex) {
          jsonStr = responseText.substring(startIndex, endIndex).trim();
        }
      }

      // Parse JSON
      const analysis = JSON.parse(jsonStr);

      // Ensure all required fields are present
      const requiredFields = [
        'overallScore',
        'stressScore',
        'wellbeingScore',
        'riskLevel',
        'keyInsights',
        'recommendations',
      ];
      for (const field of requiredFields) {
        if (!(field in analysis)) {
          throw new Error(
            `Missing required field in Gemini response: ${field}`,
          );
        }
      }

      // Construct the result object
      return {
        userId,
        date: new Date().toISOString(),
        data: assessmentData,
        analysis,
      };
    } catch (error) {
      this.logger.error(
        `Error parsing Gemini response: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to parse Gemini response: ${error.message}`);
    }
  }
}
