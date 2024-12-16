import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentTableOnCasCade1734374748411
  implements MigrationInterface
{
  name = "UpdateCommentTableOnCasCade1734374748411";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a"`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a" FOREIGN KEY ("community") REFERENCES "community"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a"`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a" FOREIGN KEY ("community") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
