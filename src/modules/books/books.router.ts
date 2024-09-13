import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { booksService } from './books.service';
import { body, param } from 'express-validator';
import { validateRequest } from '../../common/utils/validation-utils';

export const booksRouter = Router();

booksRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    // Get all books and map them to desired structure
    const books = await booksService.getBooks();

    res.status(200).json(
      books.map((book) => ({
        id: book.id,
        name: book.name,
      }))
    );
  })
);

booksRouter.get(
  '/:id',
  [param('id').isInt().withMessage('Id must be an integer')],
  expressAsyncHandler(async (req, res) => {
    // Validate path parameter to be an integer
    validateRequest(req);

    // Get book by id
    const id = req.params!.id;
    const book = await booksService.getBookById(+id);
    const score = Number(parseFloat(book.averageRating.toFixed(2)));

    res.status(200).json({
      id: book.id,
      name: book.name,
      score,
    });
  })
);

booksRouter.post(
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

    // Create book
    const name = req.body.name;
    const book = await booksService.createBook(name);

    res.status(201).json({
      id: book.id,
      name: book.name,
      score: book.averageRating,
    });
  })
);
