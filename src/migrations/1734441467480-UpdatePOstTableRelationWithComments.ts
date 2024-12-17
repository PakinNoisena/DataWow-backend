import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePOstTableRelationWithComments1734441467480
  implements MigrationInterface
{
  name = "UpdatePOstTableRelationWithComments1734441467480";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_e5492a8073292e306965b4bc364"`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a"`
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e5492a8073292e306965b4bc364" FOREIGN KEY ("post") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a" FOREIGN KEY ("community") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a"`
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_e5492a8073292e306965b4bc364"`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a" FOREIGN KEY ("community") REFERENCES "community"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e5492a8073292e306965b4bc364" FOREIGN KEY ("post") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
