import { Knex } from 'knex';

interface IKenxConfig {
    [key: string]: Knex.Config;
}

const configs: IKenxConfig = {
    development: {
        client: process.env.POSTGRES_CLIENT,
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT as unknown as number,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB_URL,
        },
        migrations: {
            extension: 'ts',
            directory: './migrations',
        },
    },
};

export default configs;
