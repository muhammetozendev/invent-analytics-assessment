# Library Management App

## How to Run

In order to launch the application in development mode, run the following command which will run the development server on port 3000:

```bash
docker-compose up
```

## Database Schema

This project is using migration feature of typeorm to keep the schema of db up to date. Schema script can be found under the path `src/database/migrations/1726143519537-schema-sync.ts`

## Side notes

- Service and repository classes are implemented as classes and necessary dependencies are injected through constructors. That is to facilitate testing. However, no test cases have been written as it's not part of the requirements

- Transactions are managed using transaction manager which holds query runner and entity manager instances for the transactional db connection. The transaction manager instance is stored in async local storage which makes it available from any part of the code from the same async context. In `Database` class, `getRepository` and `query` methods first check async local storage to see if there's an existing transaction manager. If there's, the transactional entity manager is used to get repository or execute raw query. If not, they retrieve a regular connection from connection pool and execute the query

- To retrieve average score of a book, we keep the ratings in `borrowing` table and at the same time, we store average score in books table. That is to improve performance of select queries as we wont have to join `books` table with `borrowings` table and calculate average rating using `group by` and `avg` statements

- The path `config/env` contains all the configuration related to environment variables

- Decimal.js library is used for decimal values for precision

- The folder `common` contains all the shared files like error classes, types and utilities

- The folder `database` contains migrations, transformers which are used to transform data from db to entity and vice versa, database class and transaction manager classes
