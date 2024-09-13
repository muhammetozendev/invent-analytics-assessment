import { database, Database } from '../../database/database';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { Borrowing } from './borrowing.entity';

export class BorrowingRepository {
  constructor(private readonly database: Database) {}

  async borrowBook(user: User, book: Book) {
    const borrowingRepository = await this.getBorrowingRepository();
    await borrowingRepository.save({
      book: { id: book.id },
      user: { id: user.id },
    });
  }

  async hasBorrowedBefore(user: User, book: Book): Promise<boolean> {
    const borrowingRepository = await this.getBorrowingRepository();
    const hasBorrowed = await borrowingRepository.findOne({
      where: {
        user: { id: user.id },
        book: { id: book.id },
      },
    });
    return !!hasBorrowed;
  }

  async findBorrowing(user: User, book: Book) {
    const borrowingRepository = await this.getBorrowingRepository();
    return borrowingRepository.findOne({
      where: {
        user: { id: user.id },
        book: { id: book.id },
      },
    });
  }

  async returnBook(user: User, book: Book, rating: number) {
    const borrowingRepository = await this.getBorrowingRepository();
    await borrowingRepository.update(
      {
        user: { id: user.id },
        book: { id: book.id },
      },
      {
        isReturned: true,
        rating,
      }
    );
  }

  private async getBorrowingRepository() {
    return this.database.getRepository(Borrowing);
  }
}

export const borrowingRepository = new BorrowingRepository(database);
