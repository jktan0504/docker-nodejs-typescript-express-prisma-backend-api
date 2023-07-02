import { PasswordResetCreateInput } from '@prisma/client';

export interface IPasswordReset extends PasswordResetCreateInput {
    id: number;
    email?: string;
    token?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // String index signature
}

export interface IPasswordResetQueryOptions {
    id?: number;
    email?: string;
    token?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // String index signature
}
