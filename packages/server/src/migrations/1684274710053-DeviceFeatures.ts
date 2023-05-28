import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeviceFeatures1684274710053 implements MigrationInterface {
    name = 'DeviceFeatures1684274710053';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ADD "features" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "featureState" jsonb NOT NULL DEFAULT '{}'::jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "featureState"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "features"`);
    }
}
