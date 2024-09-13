import { database, Database } from '../../database/database';
import { User } from './user.entity';

export class UsersRepository {
  constructor(private readonly database: Database) {}

  async findUserByIdWithBooks(id: number): Promise<User | null> {
    const repository = await this.getUserRepository();
    return repository.findOne({
      where: { id },
      relations: {
        borrowings: {
          book: true,
        },
      },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    const repository = await this.getUserRepository();
    return repository.findOneBy({ id });
  }

  async createUser(name: string): Promise<User> {
    const userRepository = await this.getUserRepository();
    return await userRepository.save({
      name,
    });
  }

  async findAllUsers(): Promise<User[]> {
    const repository = await this.getUserRepository();
    return repository.find();
  }

  private getUserRepository() {
    return this.database.getRepository(User);
  }
}

export const usersRepository = new UsersRepository(database);
