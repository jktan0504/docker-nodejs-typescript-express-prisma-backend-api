import { RoleCreateInput } from '@prisma/client';

export interface IPermission {
    id: string;
    name: string;
    description?: string;
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IRole extends RoleCreateInput {
    id: string;
    name: string;
    description?: string;
    permissions?: IPermission[];
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IRoleQueryOptions {
    id?: string;
    name?: string;
    description?: string;
    [key: string]: any; // String index signature
}
