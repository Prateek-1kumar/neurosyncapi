import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async saveProfile(
    uid: string,
    profileData: Partial<ProfileDto>,
  ): Promise<ProfileDto> {
    try {
      // Check if profile already exists
      let profile = await this.profileRepository.findOne({ where: { uid } });

      if (profile) {
        // Update existing profile
        profile = {
          ...profile,
          ...profileData,
        };
        await this.profileRepository.update(uid, profile);
      } else {
        // Create new profile
        profile = this.profileRepository.create({
          uid,
          ...profileData,
        });
        await this.profileRepository.save(profile);
      }

      return profile;
    } catch (error) {
      this.logger.error(`Error saving profile for user ${uid}:`, error);
      throw error;
    }
  }

  async getProfile(uid: string): Promise<ProfileDto | null> {
    try {
      const profile = await this.profileRepository.findOne({ where: { uid } });

      if (!profile) {
        this.logger.debug(`Profile not found for user ${uid}`);
        return null;
      }

      return profile;
    } catch (error) {
      this.logger.error(`Error retrieving profile for user ${uid}:`, error);
      throw error;
    }
  }
}
