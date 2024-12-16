import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePost1734358545140 implements MigrationInterface {
    name = 'CreateTablePost1734358545140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid, "community" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_4fa6dcbc711d967d86b862e042d" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a" FOREIGN KEY ("community") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_d878cf0ebd33220cfed1250e21a"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_4fa6dcbc711d967d86b862e042d"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
