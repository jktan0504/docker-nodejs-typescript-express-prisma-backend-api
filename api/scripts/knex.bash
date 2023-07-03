npx env-cmd --file .env.development npx knex --knexfile src/database/knexfile.ts migrate:latest
npx env-cmd --file .env.development npx knex --knexfile src/database/knexfile.ts migrate:make
npx env-cmd --file .env.development npx knex --knexfile src/database/knexfile.ts seed:make
npx env-cmd --file .env.development npx knex --knexfile src/database/knexfile.ts seed:run