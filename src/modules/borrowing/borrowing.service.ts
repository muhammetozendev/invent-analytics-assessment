import { BadRequestException } from '../../common/errors/bad-request-exception';
import { NotFoundException } from '../../common/errors/not-found-exception';
import { booksRepository, BooksRepository } from '../books/books.repository';
import { usersRepository, UsersRepository } from '../users/users.repository';
import {
  borrowingRepository,
  BorrowingRepository,
} from './borrowing.repository';

export class BorrowingService {
  constructor(
    private readonly borrowingRepository: BorrowingRepository,
    private readonly booksRepository: BooksRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async borrowBook(userId: number, bookId: number): Promise<void> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const book = await this.booksRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const borrowedBefore = await this.borrowingRepository.hasBorrowedBefore(
      user,
      book
    );

    if (borrowedBefore) {
      throw new BadRequestException(
        'User has already borrowed this book before'
      );
    }

    await this.borrowingRepository.borrowBook(user, book);
  }

  async returnBook(
    userId: number,
    bookId: number,
    rating: number
  ): Promise<void> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const book = await this.booksRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const borrowing = await this.borrowingRepository.findBorrowing(user, book);

    if (!borrowing) {
      throw new BadRequestException('User has not borrowed this book yet');
    }

    if (borrowing.isReturned) {
      throw new BadRequestException('Book has already been returned');
    }

    await this.borrowingRepository.returnBook(user, book, rating);

    await booksRepository.updateRating(bookId);
  }
}

export const borrowingService = new BorrowingService(
  borrowingRepository,
  booksRepository,
  usersRepository
);
