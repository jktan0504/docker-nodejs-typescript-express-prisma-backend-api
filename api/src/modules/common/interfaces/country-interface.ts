import { CountryCreateInput, CurrencyCreateInput } from '@prisma/client';

export interface ICurrency extends CurrencyCreateInput {
    id: string;
    name: string;
    code?: string;
    symbol?: string;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface ICurrencyQueryOptions {
    id?: string;
    name?: string;
    code?: string;
    symbol?: string;
    [key: string]: any; // String index signature
}

export interface ICountry extends CountryCreateInput {
    id: string;
    name: string;
    code?: string;
    timezone?: string;
    currency_id?: string;
    activated?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    [key: string]: any; // String index signature
}

export interface ICountryQueryOptions {
    id?: string;
    name?: string;
    code?: string;
    timezone?: string;
    currency_id?: string;
    [key: string]: any; // String index signature
}
