FROM node:20

# Install tzdata package
RUN apt-get update && apt-get install -y tzdata

# set timezone data
ENV TZ=Asia/Kuala_Lumpur
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# set working directory 
WORKDIR /usr/src/app

# install node_modules
COPY package.json package-lock.json ./
RUN npm ci
RUN npm install 
RUN npm i -g prisma 
RUN npm i -S multer @types/multer bcryptjs axios redis swagger-jsdoc nodemailer pino pino-pretty dayjs prom-client response-time
RUN npm i -D @types/bcryptjs @types/axios @types/redis @types/swagger-jsdoc @types/nodemailer @types/response-time @types/pino @types/pino-pretty

# copy codebase to docker codebase
COPY . .

# prisma
# generated prisma files
RUN npx prisma generate 

# COPY prisma /usr/src/app/prisma
# COPY prisma/* /usr/src/app/prismad
# RUN npx prisma generate --schema ./prisma/schema.prisma
# RUN npm run dev:prisma:generate

COPY ../.env /usr/src/app

# knex
RUN npm run dev:db:migrate
# RUN npm run dev:db:seed

EXPOSE 8080 9000 9100

# RUN echo "Asia/Kuala_Lumpur" > /etc/timezone 

CMD ["npm", "run", "dev:start:docker"]