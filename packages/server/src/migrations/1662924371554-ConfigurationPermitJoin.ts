import type { MigrationInterface, QueryRunner } from 'typeorm';

import { ConfigurationType } from '../entities/configurationEntity';

export class ConfigurationPermitJoin1662924371554 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE "configurations" SET data = data || '{"permitDevicesJoin":true}' WHERE data ->> 'type' = '${ConfigurationType.ZigbeeBridge}'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE "configurations" SET data = data - 'permitDevicesJoin' WHERE data ->> 'type' = '${ConfigurationType.ZigbeeBridge}'`,
        );
    }
}
