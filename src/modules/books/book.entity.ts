import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../../database/transformers/decimal.transformer';
import Decimal from 'decimal.js';
import { Borrowing } from '../borrowing/borrowing.entity';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Average rating column is duplicated to this table for performance reasons
  @Column({
    name: 'average_rating',
    type: 'decimal',
    transformer: decimalTransformer,
  })
  averageRating: Decimal; // Using decimal.js for precision

  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowings: Borrowing[];
}
