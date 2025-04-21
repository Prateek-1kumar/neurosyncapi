import { Module } from '@nestjs/common';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

@Module({
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class AuthModule {}
