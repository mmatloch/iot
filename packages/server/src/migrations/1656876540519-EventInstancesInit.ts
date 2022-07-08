import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventInstancesInit1656876540519 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`);
        await queryRunner.query(`SELECT create_hypertable('eventinstances', '_createdAt');`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE trades;`);
        await queryRunner.query(`DROP EXTENSION timescaledb;`);
    }
}
