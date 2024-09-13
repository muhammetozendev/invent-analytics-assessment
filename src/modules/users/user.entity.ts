import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Borrowing } from '../borrowing/borrowing.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.user)
  borrowings: Borrowing[];
}
