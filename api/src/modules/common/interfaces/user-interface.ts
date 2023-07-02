import { UserCreateInput } from '@prisma/client';

export interface IUser extends UserCreateInput {
    id: string;
    username?: string;
    full_name?: string;
    email: string;
    password?: string;
    contact_number?: string;
    gender?: string;
    age?: number;
    remarks?: string;
    apple_device_id?: string;
    avatar?: string;
    role_id?: string;
    country_id?: string;
    membership_id?: string;
    provider_id?: string;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IUserQueryOptions {
    id?: string;
    username?: string;
    full_name?: string;
    email?: string;
    password?: string;
    contact_number?: string;
    gender?: string;
    age?: number;
    remarks?: string;
    apple_device_id?: string;
    avatar?: string;
    role_id?: string;
    country_id?: string;
    membership_id?: string;
    provider_id?: string;
    [key: string]: any; // String index signature
}
