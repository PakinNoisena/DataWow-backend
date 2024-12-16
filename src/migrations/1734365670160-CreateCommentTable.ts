import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentTable1734365670160 implements MigrationInterface {
    name = 'CreateCommentTable1734365670160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "commented_by" uuid, "post" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_774ba1d88b70935793ca5ebb6e5" FOREIGN KEY ("commented_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e5492a8073292e306965b4bc364" FOREIGN KEY ("post") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e5492a8073292e306965b4bc364"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_774ba1d88b70935793ca5ebb6e5"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
