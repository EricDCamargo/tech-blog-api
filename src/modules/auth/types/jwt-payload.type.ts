import { Role } from 'generated/prisma/client';
import { RT } from './tokens.type';

type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

// Se for o payload do Refresh Token, ele ganha o campo extra da strategy
type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type { JwtPayload, JwtPayloadWithRt };
