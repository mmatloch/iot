import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EventScheduler1660911283007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "state" text NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "events" ADD "metadata" jsonb`);

        await queryRunner.query(
            `CREATE TABLE "eventschedulertasks" ("_id" SERIAL NOT NULL, "_version" integer NOT NULL, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nextRunAt" TIMESTAMP NOT NULL, "state" text NOT NULL, "eventId" integer, CONSTRAINT "PK_152c09688c7916867a9c3bd9fe2" PRIMARY KEY ("_id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "eventschedulertasks" ADD CONSTRAINT "FK_3ddcde09c50781170c1fd329788" FOREIGN KEY ("eventId") REFERENCES "events"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "metadata"`);

        await queryRunner.query(`ALTER TABLE "eventschedulertasks" DROP CONSTRAINT "FK_3ddcde09c50781170c1fd329788"`);
        await queryRunner.query(`DROP TABLE "eventschedulertasks"`);
    }
}
