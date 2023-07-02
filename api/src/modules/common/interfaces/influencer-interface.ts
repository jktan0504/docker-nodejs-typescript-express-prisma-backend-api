import { InfluencerCreateInput } from '@prisma/client';

export interface Iinfluencer extends InfluencerCreateInput {
    id: string;
    username?: string;
    full_name?: string;
    bio?: string;
    num_of_followers?: number;
    avatar?: string;
    role_id?: string;
    country_id?: string;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface IinfluencerQueryOptions {
    id?: string;
    username?: string;
    full_name?: string;
    bio?: string;
    num_of_followers?: number;
    avatar?: string;
    role_id?: string;
    country_id?: string;
    [key: string]: any; // String index signature
}
