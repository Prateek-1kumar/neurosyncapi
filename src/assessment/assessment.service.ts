import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { AssessmentData, AssessmentResult } from './types/assessment.types';
import { GeminiService } from './gemini.service';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    private geminiService: GeminiService,
  ) {}

  async createAssessment(
    userId: string,
    assessmentData: AssessmentData,
  ): Promise<AssessmentResult> {
    try {
      // Get analysis from Gemini API
      const result = await this.geminiService.analyzeAssessmentData(
        assessmentData,
        userId,
      );

      // Save to database
      const assessment = this.assessmentRepository.create({
        userId,
        data: assessmentData,
        analysis: result.analysis,
      });

      const savedAssessment = await this.assessmentRepository.save(assessment);

      return {
        id: savedAssessment.id,
        userId: savedAssessment.userId,
        date: savedAssessment.date.toISOString(),
        data: savedAssessment.data,
        analysis: savedAssessment.analysis,
      };
    } catch (error) {
      this.logger.error(
        `Error creating assessment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUserAssessments(userId: string): Promise<AssessmentResult[]> {
    try {
      const assessments = await this.assessmentRepository.find({
        where: { userId },
        order: { date: 'DESC' },
      });

      return assessments.map((assessment) => ({
        id: assessment.id,
        userId: assessment.userId,
        date: assessment.date.toISOString(),
        data: assessment.data,
        analysis: assessment.analysis,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching user assessments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAssessmentById(id: string): Promise<AssessmentResult | null> {
    try {
      const assessment = await this.assessmentRepository.findOne({
        where: { id },
      });

      if (!assessment) {
        return null;
      }

      return {
        id: assessment.id,
        userId: assessment.userId,
        date: assessment.date.toISOString(),
        data: assessment.data,
        analysis: assessment.analysis,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching assessment by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
