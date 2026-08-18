import jwt from 'jsonwebtoken';
import { JwtConstantsCollection } from './jwt.constants.ts';
import type { JwtTypeCollection } from './jwt.types.ts';

const getJwtSecret = () => {
  const jwtSecret = process.env['JWT_SECRET'];
  if (jwtSecret === undefined || jwtSecret === '') {
    throw new Error('JWT_SECRET is required');
  }

  return jwtSecret;
};

const isAccessToken = (
  value: string | jwt.JwtPayload,
): value is JwtTypeCollection['AccessToken'] => {
  if (typeof value === 'string') {
    return false;
  }

  if (!('userId' in value)) {
    return false;
  }

  return typeof value['userId'] === 'string';
};

const generateAccessToken = ({ userId }: JwtTypeCollection['AccessToken']) => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: JwtConstantsCollection.accessTokenExpirationMs / 1000,
  });
};

const verifyAccessToken = ({ token }: { token: string }) => {
  const decoded = jwt.verify(token, getJwtSecret());

  if (!isAccessToken(decoded)) {
    throw new Error('Invalid access token');
  }

  return decoded;
};

export const JwtCollection = {
  generateAccessToken,
  verifyAccessToken,
};
