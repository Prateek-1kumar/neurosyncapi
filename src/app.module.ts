import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { FirebaseModule } from './firebase/firebase.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AssessmentModule } from './assessment/assessment.module';

@Module({
  imports: [
    ConfigModule,
    FirebaseModule,
    DatabaseModule,
    AuthModule,
    ProfileModule,
    AssessmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
