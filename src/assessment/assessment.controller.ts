import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentResponseDto } from './dto/assessment-response.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RequestWithFirebaseUser } from '../auth/interfaces/firebase-user.interface';
import { ApiCrudResponses } from '../common/decorators/api-responses.decorator';

@ApiTags('assessment')
@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-jwt')
  @ApiOperation({ summary: 'Create a new mental health assessment' })
  @ApiCrudResponses({
    successStatus: 201,
    successDescription: 'Assessment created successfully',
    dataType: AssessmentResponseDto,
  })
  async createAssessment(
    @Req() req: RequestWithFirebaseUser,
    @Body() createAssessmentDto: CreateAssessmentDto,
  ): Promise<AssessmentResponseDto> {
    const userId = req.user.uid;
    return this.assessmentService.createAssessment(userId, createAssessmentDto);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-jwt')
  @ApiOperation({ summary: 'Get all assessments for the current user' })
  @ApiCrudResponses({
    successStatus: 200,
    successDescription: 'Assessments retrieved successfully',
    dataType: [AssessmentResponseDto],
  })
  async getUserAssessments(
    @Req() req: RequestWithFirebaseUser,
  ): Promise<AssessmentResponseDto[]> {
    const userId = req.user.uid;
    return this.assessmentService.getUserAssessments(userId);
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-jwt')
  @ApiOperation({ summary: 'Get an assessment by ID' })
  @ApiParam({ name: 'id', description: 'Assessment ID' })
  @ApiCrudResponses({
    successStatus: 200,
    successDescription: 'Assessment retrieved successfully',
    dataType: AssessmentResponseDto,
    includeNotFoundResponse: true,
  })
  async getAssessmentById(
    @Req() req: RequestWithFirebaseUser,
    @Param('id') id: string,
  ): Promise<AssessmentResponseDto> {
    const userId = req.user.uid;
    const assessment = await this.assessmentService.getAssessmentById(id);

    if (!assessment || assessment.userId !== userId) {
      throw new NotFoundException('Assessment not found');
    }

    return assessment;
  }
}
