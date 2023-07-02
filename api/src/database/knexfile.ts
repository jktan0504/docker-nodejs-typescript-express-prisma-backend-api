import type { Knex } from 'knex';

// Update with your config settings.
interface IKenxConfig {
    [key: string]: Knex.Config;
}

const configs: IKenxConfig = {
    development: {
        client: process.env.POSTGRES_CLIENT,
        connection: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT) as unknown as number,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            connTimeout: 100000, // 10 seconds
            timezone: 'Asia/Kuala_Lumpur',
        },
        pool: {
            min: 2,
            max: 10,
            createTimeoutMillis: 3000,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 100,
            propagateCreateError: false, // <- default is true, set to false
        },
        migrations: {
            extension: 'ts',
            directory: './migrations',
        },
    },

    staging: {
        client: process.env.POSTGRES_CLIENT,
        connection: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT) as unknown as number,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            connTimeout: 100000, // 10 seconds
            timezone: 'Asia/Kuala_Lumpur',
        },
        pool: {
            min: 2,
            max: 10,
            createTimeoutMillis: 3000,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 100,
            propagateCreateError: false, // <- default is true, set to false
        },
        migrations: {
            extension: 'ts',
            directory: './migrations',
        },
    },

    production: {
        client: process.env.POSTGRES_CLIENT,
        connection: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT) as unknown as number,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            connTimeout: 100000, // 10 seconds
            timezone: 'Asia/Kuala_Lumpur',
        },
        pool: {
            min: 2,
            max: 10,
            createTimeoutMillis: 3000,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 100,
            propagateCreateError: false, // <- default is true, set to false
        },
        migrations: {
            extension: 'ts',
            directory: './migrations',
        },
    },
};

module.exports = configs;
