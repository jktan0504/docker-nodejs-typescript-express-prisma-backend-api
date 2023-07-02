# Nodejs Express Prisma Tyescript Backend Introduction

## What is this repo covers?

- Backbone of backend code that will provide API level service and Stand alone service
- SQL DataBase Migration via [Knex](https://www.npmjs.com/package/knex)
- SQL DataBase Connection & Commuication via [Prisma](https://www.npmjs.com/package/prisma)
- Cache management via [Redis](https://www.npmjs.com/package/redis)
- Queue management via [Redis](https://www.npmjs.com/package/node-redis-pubsub)
- CRUD Operation for a resource within MVC architecture
- Import CSV management via `S3` Presigned URLs
- Batch Insert into DataBase's Table
- Batch Delete from DataBase's Table

## What is the technical stack?

- Docker to build Postgresql Database and Redis instances
- ExpressJs with TypeScript
- Knex to handle Database migration
- Prisma to handle Database management
- Redis to handle cache and pub/sub management
- Jest to handle testing
- Nodemon to handle local development build and run
- Docker to handle build, deployment and run on AWS EC2

## How to run this app locally?

- Make sure you have `NodeJs, Npm, Yarn, and Docker` installed on your machine
- Make sure `Docker is up and running`
- Create `.env.development` for local environment, `.ene.test` for test environment
- Run command `npm install` to download all required packages
- Run command `npm docker:build` to build docker images for DB + Redis
- Run command `npm docker:up` to run docker images for DB + Redis
- Run command `npm start:development` to start the app locally
  - This command will build then export the TS app to build folder then run it from there
  - Changes will be caught and the app will be rebuilt and reloaded via `nodemon`

## How to stop the app?

- Exit the app via (command + c for `mac` and control + c for `windows + linux`)
- Run command `npm docker:down` to shutdown docker images for DB + Redis

## How to add a new migration file?

- As we are using kenx with typescript and we are relying on dist folder to manage our work, we identified the path to kenx in node modules to be the start point
  - example: `Create a new user table`
    - Run command `npm knex migrate:make create-user-table`
- So in short add `npm` to any `knex` command to work as expected

## How to manage CSV upload?

[Reference](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_Scenario_PresignedUrl_section.html)

- Create Presigned URL so FrontEnd can use to upload data to CSV
- Use the Presigned URL to upload data to S3
- Once upload completed, PS: `CSV Validation from FrontEnd`
- Call operation (I.E: `Create entities based on CSV`)