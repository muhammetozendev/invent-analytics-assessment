import { DataSource, EntityManager, QueryRunner } from 'typeorm';

export class TransactionManager {
  private runningTransaction = false;
  queryRunner: QueryRunner;
  entityManager: EntityManager;

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction();
    this.runningTransaction = true;
    this.entityManager = this.queryRunner.manager;
  }

  async commitTransaction(): Promise<void> {
    if (!this.runningTransaction) {
      throw new Error('No transaction is running');
    }
    await this.queryRunner.commitTransaction();
    this.runningTransaction = false;
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.runningTransaction) {
      throw new Error('No transaction is running');
    }
    await this.queryRunner.rollbackTransaction();
    this.runningTransaction = false;
  }

  async release(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.release();
    }
  }
}
