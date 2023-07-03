docker-compose -f docker-compose.yml -f docker-compose.development.yml up 
clear; docker-compose --env-file .env.development -f docker-compose.local.yml up -d --build