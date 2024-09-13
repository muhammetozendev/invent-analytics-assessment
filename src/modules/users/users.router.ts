import { Router } from 'express';
import { usersService } from './users.service';
import expressAsyncHandler from 'express-async-handler';
import { body, param } from 'express-validator';
import { validateRequest } from '../../common/utils/validation-utils';
import { borrowingService } from '../borrowing/borrowing.service';
import { database } from '../../database/database';

export const usersRouter = Router();

usersRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    // Retrieve all users
    const users = await usersService.getUsers();

    // Map the data to desired structure
    const data = users.map((e) => ({
      id: e.id,
      name: e.name,
    }));

    // Return the response
    res.status(200).json(data);
  })
);

usersRouter.post(
  '/',
  [
    body('name')
      .trim()
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be a string with length between 1 and 255'),
  ],
  expressAsyncHandler(async (req, res) => {
    // Validate request body
    validateRequest(req);

    const name = req.body.name;
    const user = await usersService.createUser(name);
    res.status(201).send({
      id: user.id,
      name: user.name,
    });
  })
);

usersRouter.get(
  '/:id',
  [param('id').isInt().withMessage('Id must be an integer')],
  expressAsyncHandler(async (req, res) => {
    // Validate path parameter to be an integer
    validateRequest(req);

    // Retrieve user along with their borrowings
    const id = req.params!.id;

    const { user, pastBorrowings, presentBorrowings } =
      await usersService.findUserById(+id);

    // Map the data to desired structure
    const past = pastBorrowings.map((e) => ({
      name: e.book.name,
      userScore: e.rating,
    }));

    const present = presentBorrowings.map((e) => ({
      name: e.book.name,
    }));

    // Return the response
    res.status(200).json({
      id: user.id,
      name: user.name,
      books: {
        past,
        present,
      },
    });
  })
);

usersRouter.post(
  '/:userId/borrow/:bookId',
  [
    param('userId').isInt().withMessage('User id must be an integer'),
    param('bookId').isInt().withMessage('Book id must be an integer'),
  ],
  expressAsyncHandler(async (req, res) => {
    // Validate path parameters to be integers
    validateRequest(req);

    // Borrow book
    await borrowingService.borrowBook(+req.params!.userId, +req.params!.bookId);

    res.status(204).send();
  })
);

usersRouter.post(
  '/:userId/return/:bookId',
  [
    param('userId').isInt().withMessage('User id must be an integer'),
    param('bookId').isInt().withMessage('Book id must be an integer'),
    body('score')
      .isInt({ min: 1, max: 10 })
      .withMessage('Score must be between 1 and 10'),
  ],
  expressAsyncHandler(async (req, res) => {
    // Validate path parameters to be integers
    validateRequest(req);

    // Return book
    const userId = req.params!.userId;
    const bookId = req.params!.bookId;
    const score = req.body.score;

    // Run the operation in transaction as there are 2 update queries for 2 different tables
    await database.transaction(async () => {
      await borrowingService.returnBook(+userId, +bookId, score);
    });

    res.status(204).send();
  })
);
