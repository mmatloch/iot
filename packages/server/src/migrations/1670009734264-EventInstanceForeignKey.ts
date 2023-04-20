import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EventInstanceForeignKey1670009734264 implements MigrationInterface {
    name = 'EventInstanceForeignKey1670009734264';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "eventinstances" ADD "event" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "eventinstances" DROP COLUMN "event"`);
    }
}
