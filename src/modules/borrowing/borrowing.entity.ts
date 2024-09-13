import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity({ name: 'borrowing' })
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column({ name: 'is_returned' })
  isReturned: boolean;

  @ManyToOne(() => User, (user) => user.borrowings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrowings)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
