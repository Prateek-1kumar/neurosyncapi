import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiCrudResponses } from '../common/decorators/api-responses.decorator';
import { RequestWithFirebaseUser } from '../auth/interfaces/firebase-user.interface';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-jwt')
  @ApiOperation({ summary: 'Save or update user profile' })
  @ApiCrudResponses({
    successStatus: 201,
    successDescription: 'Profile saved successfully',
    dataType: ProfileDto,
  })
  async saveProfile(
    @Req() req: RequestWithFirebaseUser,
    @Body() profileData: CreateProfileDto,
  ): Promise<ProfileDto> {
    const uid = req.user.uid;
    return this.profileService.saveProfile(uid, profileData);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-jwt')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiCrudResponses({
    successStatus: 200,
    successDescription: 'Profile retrieved successfully',
    dataType: ProfileDto,
    includeNotFoundResponse: true,
  })
  async getProfile(@Req() req: RequestWithFirebaseUser): Promise<ProfileDto> {
    const uid = req.user.uid;
    const profile = await this.profileService.getProfile(uid);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
