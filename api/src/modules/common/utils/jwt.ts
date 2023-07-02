import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

export const generateAccessToken = async (
    user: User,
    secretKey: string,
    issuer: string,
) => {
    try {
        return jwt.sign({ id: user.id }, secretKey, {
            expiresIn: '1M',
            issuer,
        });
    } catch (error) {
        return {
            error: `bcryptjs:${error as unknown as string}`,
        };
    }
};
