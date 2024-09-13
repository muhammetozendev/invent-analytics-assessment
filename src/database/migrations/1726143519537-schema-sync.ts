import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1726143519537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "books" (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        average_rating DECIMAL(4, 2) NOT NULL DEFAULT -1
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "borrowing" (
        id BIGSERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        book_id INT REFERENCES books(id),
        rating INT,
        is_returned BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "borrowing";`);
    await queryRunner.query(`DROP TABLE "books";`);
    await queryRunner.query(`DROP TABLE "users";`);
  }
}
