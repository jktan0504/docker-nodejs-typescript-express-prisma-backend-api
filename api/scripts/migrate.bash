#!/bin/bash

echo "Knex Migration is running"

# Create Table
# npx knex migrate:make create_provider_table -x ts

# Migrate
npx env-cmd --file ../../../.env.development npx knex migrate:latest