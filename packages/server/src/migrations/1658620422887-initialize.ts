import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialize1658620422887 implements MigrationInterface {
    name = 'initialize1658620422887';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`);

        /**
         * Devices
         */
        await queryRunner.query(
            `CREATE TABLE "devices" ("_id" SERIAL NOT NULL, "_version" integer NOT NULL, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "displayName" text NOT NULL, "model" text NOT NULL, "vendor" text NOT NULL, "manufacturer" text NOT NULL, "description" text NOT NULL, "ieeeAddress" text NOT NULL, "powerSource" text NOT NULL, "type" text NOT NULL, "protocol" text NOT NULL, "state" text NOT NULL, "deactivatedBy" jsonb, CONSTRAINT "UQ_a150b43728d9c96a87139cd467c" UNIQUE ("ieeeAddress"), CONSTRAINT "PK_06e54be2989de9043573759c83a" PRIMARY KEY ("_id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89c2583f8d1d6d035fe5273162" ON "devices" ("displayName") `);

        /**
         * Events
         */
        await queryRunner.query(
            `CREATE TABLE "events" ("_id" SERIAL NOT NULL, "_version" integer NOT NULL, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "displayName" text NOT NULL, "name" text NOT NULL, "triggerType" text NOT NULL, "triggerFilters" jsonb NOT NULL DEFAULT '{}', "conditionDefinition" text NOT NULL, "actionDefinition" text NOT NULL, CONSTRAINT "PK_1e1bcbbe73c497e1c9a8c11b5a1" PRIMARY KEY ("_id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b93a84ee48d5a41720b10fa099" ON "events" ("displayName") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dfa3d03bef3f90f650fd138fb3" ON "events" ("name") `);

        /**
         * Event instances
         */
        await queryRunner.query(
            `CREATE TABLE "eventinstances" ("_id" SERIAL NOT NULL, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_version" integer NOT NULL, "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer NOT NULL, "triggerContext" jsonb NOT NULL DEFAULT '{}', "state" text NOT NULL, "error" jsonb, "performanceMetrics" jsonb NOT NULL, "triggeredByEventId" integer, CONSTRAINT "PK_8877e6aaa9abd81d7d7e058a421" PRIMARY KEY ("_id", "_createdAt"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_fdf7b11ea2766325d94894f770" ON "eventinstances" ("eventId", "_createdAt") `,
        );

        await queryRunner.query(`SELECT create_hypertable('eventinstances', '_createdAt');`);

        /**
         * Sensor data
         */
        await queryRunner.query(
            `CREATE TABLE "sensordata" ("_id" SERIAL NOT NULL, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_version" integer NOT NULL, "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deviceId" integer NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_d4dbd15c7aa276f4d5fdb291719" PRIMARY KEY ("_id", "_createdAt"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_87239200e7c9d6b1201be776f9" ON "sensordata" ("deviceId", "_createdAt") `,
        );

        await queryRunner.query(`SELECT create_hypertable('sensordata', '_createdAt');`);
        await queryRunner.query(`CREATE INDEX IDX_data_gin ON sensordata USING GIN (data);`);

        /**
         * Users
         */
        await queryRunner.query(
            `CREATE TABLE "users" ("_id" SERIAL NOT NULL, "_version" integer NOT NULL, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" text NOT NULL, "lastName" text NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "role" text NOT NULL, "state" text NOT NULL, CONSTRAINT "PK_46c438e5a956fb9c3e86e73e321" PRIMARY KEY ("_id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87239200e7c9d6b1201be776f9"`);
        await queryRunner.query(`DROP TABLE "sensordata"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdf7b11ea2766325d94894f770"`);
        await queryRunner.query(`DROP TABLE "eventinstances"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dfa3d03bef3f90f650fd138fb3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b93a84ee48d5a41720b10fa099"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89c2583f8d1d6d035fe5273162"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }
}
