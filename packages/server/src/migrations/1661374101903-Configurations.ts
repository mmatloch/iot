import { MigrationInterface, QueryRunner } from 'typeorm';

import { ConfigurationType } from '../entities/configurationEntity';

export class Configurations1661374101903 implements MigrationInterface {
    name = 'Configurations1661374101903';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "configurations" ("_id" SERIAL NOT NULL, "_version" integer NOT NULL, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_createdBy" integer, "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "_updatedBy" integer, "state" text NOT NULL, "data" jsonb NOT NULL, CONSTRAINT "PK_267fa596dbea9a29e5a3cf9278b" PRIMARY KEY ("_id"))`,
        );

        await queryRunner.query(
            `CREATE UNIQUE INDEX IDX_unique_type_zigbee_bridge on "configurations"((data->>'type')) WHERE (data->>'type' = '${ConfigurationType.ZigbeeBridge}')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "configurations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_unique_type_zigbee_bridge"`);
    }
}
