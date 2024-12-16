import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCommunityData1734356507098 implements MigrationInterface {
  name = "SeedCommunityData1734356507098";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO community (name)
            VALUES 
                ('History'),
                ('Pets'),
                ('Health'),
                ('Fashion'),
                ('Exercise'),
                ('Others');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM community
            WHERE name IN ('History', 'Pets', 'Health', 'Fashion', 'Exercise', 'Others');
        `);
  }
}
