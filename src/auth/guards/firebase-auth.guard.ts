import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseModule } from '../../firebase/firebase.module';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token not found');
    }

    try {
      const decodedToken = await FirebaseModule.getAuth().verifyIdToken(token);

      // Set the user object on the request
      const user: FirebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name,
        picture: decodedToken.picture,
      };

      request.user = user;
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
