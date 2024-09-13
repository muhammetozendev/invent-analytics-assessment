import { NotFoundException } from '../../common/errors/not-found-exception';
import { usersRepository, UsersRepository } from './users.repository';

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers() {
    return this.usersRepository.findAllUsers();
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findUserByIdWithBooks(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pastBorrowings = user.borrowings.filter((e) => e.isReturned === true);

    const presentBorrowings = user.borrowings.filter(
      (e) => e.isReturned === false
    );

    return { user, pastBorrowings, presentBorrowings };
  }

  async createUser(name: string) {
    return this.usersRepository.createUser(name);
  }
}

export const usersService = new UsersService(usersRepository);
