import { database, Database } from '../../database/database';
import { Book } from './book.entity';

export class BooksRepository {
  constructor(private readonly database: Database) {}

  async findAllBooks() {
    const repository = await this.getBookRepository();
    return repository.find();
  }

  async findBookById(id: number) {
    const repository = await this.getBookRepository();
    return repository.findOneBy({ id });
  }

  async createBookRepository(name: string) {
    const repository = await this.getBookRepository();
    return repository.save({
      name,
      averageRating: -1,
    });
  }

  async updateRating(bookId: number) {
    await this.database.query(
      `
      UPDATE books
      SET average_rating = (
        SELECT AVG(rating)
        FROM borrowing
        WHERE book_id = $1
      )
      WHERE id = $2
    `,
      [bookId, bookId]
    );
  }

  private getBookRepository() {
    return this.database.getRepository(Book);
  }
}

export const booksRepository = new BooksRepository(database);
