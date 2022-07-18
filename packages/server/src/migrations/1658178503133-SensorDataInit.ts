import { MigrationInterface, QueryRunner } from 'typeorm';

export class SensorDataInit1658178503133 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`);
        await queryRunner.query(`SELECT create_hypertable('sensordata', '_createdAt');`);
        await queryRunner.query(`CREATE INDEX IDX_data_gin ON sensordata USING GIN (data);`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE sensordata;`);
        await queryRunner.query(`DROP EXTENSION timescaledb;`);
    }
}
