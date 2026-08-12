/*
- To install new postgreSQL 
>brew install postgresql@15   NOT USE if satisfy installed 

- To ensure and verify postgreSQL installed by checjing version 
>psql --version

- Database Configurations :
----------------------
*(1)* Check PostgreSql version 
psql --version

*(2)* Open Postgres and Create a new DB
psql -U postgres

Enter your PostgreSQL password
there db connected
*(3)* Once connected (you'll see postgres=# prompt)

Create new db:
postgres=# CREATE DATABASE ecommerce_db;
Result CREATE DATABASE

*(4)* Verify Creation
postgres=#    sql
postgres=#    \l
Result Display all databases created table

*(5)* Exit psql
postgres=# sql
postgres=# \q

-Create Superuser
server> py manage.py createsuperuser

-Install react and tailwindcss:-
----------------------------
- npm create vite@latest frontend
- npm install tailwindcss @tailwindcss/vite


*/