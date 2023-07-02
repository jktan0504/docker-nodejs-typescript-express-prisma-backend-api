import { ProviderCreateInput } from '@prisma/client';

export interface IProvider extends ProviderCreateInput {
    id: string;
    name: string;
    description?: string;
    key?: string;
    secret_key?: string;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IProviderQueryOptions {
    id?: string;
    name?: string;
    description?: string;
    key?: string;
    secret_key?: string;
    [key: string]: any; // String index signature
}
