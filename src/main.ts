import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { applicationConfig } from './config/env/application.config';
import { usersRouter } from './modules/users/users.router';
import { booksRouter } from './modules/books/books.router';
import { database } from './database/database';
import { BaseException } from './common/errors/base-exception';

export const app = express();

// Request parsing middleware
app.use(express.json());

// Route definitions
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseException) {
    res.status(err.status).json({
      ...err,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      type: 'InternalServerError',
    });
  }
});

// Connect to the database
database.getDataSource();

// Start the application
app.listen(applicationConfig.port, () => {
  console.log(`Server is running on port ${applicationConfig.port}`);
});
