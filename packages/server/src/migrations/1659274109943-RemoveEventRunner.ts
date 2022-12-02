import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEventRunner1659274109943 implements MigrationInterface {
    name = 'RemoveEventRunner1659274109943';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

        await queryRunner.query(`DROP INDEX "public"."IDX_dfa3d03bef3f90f650fd138fb3"`);
        await queryRunner.query(`ALTER TABLE "eventinstances" DROP COLUMN "triggeredByEventId"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "eventinstances" ADD "parentEventId" integer`);
        await queryRunner.query(
            `ALTER TABLE "eventinstances" ADD "eventRunId" text NOT NULL DEFAULT gen_random_uuid()`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP EXTENSION IF EXISTS pgcrypto`);

        await queryRunner.query(`ALTER TABLE "eventinstances" DROP COLUMN "eventRunId"`);
        await queryRunner.query(`ALTER TABLE "eventinstances" DROP COLUMN "parentEventId"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "eventinstances" ADD "triggeredByEventId" integer`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dfa3d03bef3f90f650fd138fb3" ON "events" ("name") `);
    }
}
