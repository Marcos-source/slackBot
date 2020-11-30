#!/bin/bash
source .env
DB_NAME=${DB_NAME:=henryapp}
DB_PORT=${DB_PORT:=5432}

echo " = Dropping and recreating database... = "
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER postgres -c "DROP DATABASE IF EXISTS ${DB_NAME}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER postgres -c "CREATE DATABASE ${DB_NAME}"
echo " = Creating schema... = "
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER ${DB_NAME} < ./src/data/tables.sql
echo " = Inserting some data... = "
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER ${DB_NAME} < ./src/data/inserts.sql
