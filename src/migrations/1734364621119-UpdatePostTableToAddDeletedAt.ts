import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostTableToAddDeletedAt1734364621119
  implements MigrationInterface
{
  name = "UpdatePostTableToAddDeletedAt1734364621119";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deleted_at"`);
  }
}
