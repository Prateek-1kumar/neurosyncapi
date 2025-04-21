import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as serviceAccount from './config/firebase-service-account.json';

@Module({
  exports: [FirebaseModule],
})
export class FirebaseModule implements OnModuleInit {
  private readonly logger = new Logger(FirebaseModule.name);
  private static app: admin.app.App;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    if (!admin.apps.length) {
      try {
        // Initialize the app for authentication only
        FirebaseModule.app = admin.initializeApp({
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
          projectId: 'healthaware-857f5',
        });

        this.logger.log(
          '✅ Firebase App initialized successfully for authentication',
        );
      } catch (error) {
        this.logger.error('❌ Firebase initialization error:', error);
        throw error;
      }
    } else {
      // App already initialized, get the instance
      FirebaseModule.app = admin.app();
      this.logger.log('Firebase app instance retrieved for existing app');
    }
  }

  // Static method to get the Firebase auth module
  static getAuth(): admin.auth.Auth {
    if (!FirebaseModule.app) {
      throw new Error('Firebase is not initialized or configuration failed.');
    }
    return FirebaseModule.app.auth();
  }
}
