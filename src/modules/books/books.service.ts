import { NotFoundException } from '../../common/errors/not-found-exception';
import { booksRepository, BooksRepository } from './books.repository';

export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async getBooks() {
    return this.booksRepository.findAllBooks();
  }

  async getBookById(id: number) {
    const book = await this.booksRepository.findBookById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async createBook(name: string) {
    return this.booksRepository.createBookRepository(name);
  }
}

export const booksService = new BooksService(booksRepository);
