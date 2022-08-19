import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventScheduler1660911283007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "state" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "metadata"`);
    }
}
