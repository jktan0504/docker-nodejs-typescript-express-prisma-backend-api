import { MembershipCreateInput } from '@prisma/client';

export interface IMembership extends MembershipCreateInput {
    id: string;
    name: string;
    description?: string;
    price?: number;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IMembershipQueryOptions {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    [key: string]: any; // String index signature
}
