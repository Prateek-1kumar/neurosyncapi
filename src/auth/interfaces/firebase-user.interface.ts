import { Request } from 'express';

export interface FirebaseUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
}

export interface RequestWithFirebaseUser extends Request {
  user: FirebaseUser;
}
