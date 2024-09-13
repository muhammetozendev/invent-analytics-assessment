import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { dbConfig } from '../config/env/db.config';
import {
  applicationConfig,
  Environment,
} from '../config/env/application.config';
import { ClassConstructor } from '../common/types/class-constructor';
import { AsyncLocalStorage } from 'async_hooks';
import { TransactionManager } from './transaction-manager';
import { User } from '../modules/users/user.entity';
import { Borrowing } from '../modules/borrowing/borrowing.entity';
import { Book } from '../modules/books/book.entity';

export class Database {
  private dataSource: DataSource;
  private als = new AsyncLocalStorage<TransactionManager>();

  /** Lazily initialize the data source */
  async getDataSource(): Promise<DataSource> {
    if (this.dataSource) {
      return this.dataSource;
    }

    this.dataSource = new DataSource({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      username: dbConfig.username,
      password: dbConfig.password,
      entities: [User, Borrowing, Book],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: applicationConfig.environment == Environment.DEVELOPMENT,
    });
    await this.dataSource.initialize();

    return this.dataSource;
  }

  /** Close databse connection */
  async closeConnection(): Promise<void> {
    if (this.dataSource) {
      await this.dataSource.destroy();
    }
  }

  /** Run pending migrations */
  async runMigrations(): Promise<void> {
    await this.getDataSource();
    await this.dataSource.runMigrations();
  }

  /** Get repository */
  async getRepository<T extends ObjectLiteral>(
    entity: ClassConstructor<T>
  ): Promise<Repository<T>> {
    const dataSource = await this.getDataSource();
    const transactionManager = this.als.getStore();
    const em = transactionManager?.entityManager || dataSource.manager;
    return em.getRepository(entity);
  }

  /** Execute raw query */
  async query<T>(query: string, parameters?: any[]): Promise<any> {
    const dataSource = await this.getDataSource();
    const transactionManager = this.als.getStore();
    const em = transactionManager?.entityManager || dataSource.manager;
    return em.query<T>(query, parameters);
  }

  /** Run callback in transaction */
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    // if there's already an active transaction, just run the callback
    const activeTransaction = this.als.getStore();
    if (activeTransaction) {
      return await callback();
    }

    // If not, create a new transaction manager and save it in async local storage before running the callback
    // Transaction manager will be automatically cleaned up async context is destroyed
    const dataSource = await this.getDataSource();
    const transactionManager = new TransactionManager(dataSource);
    return this.als.run(transactionManager, async () => {
      await transactionManager.startTransaction();
      try {
        const result = await callback();
        await transactionManager.commitTransaction();
        return result;
      } catch (error) {
        await transactionManager.rollbackTransaction();
        throw error;
      } finally {
        await transactionManager.release();
      }
    });
  }
}

export const database = new Database();
