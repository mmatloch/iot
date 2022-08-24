import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedByUpdatedBy1661175358951 implements MigrationInterface {
    name = 'CreatedByUpdatedBy1661175358951';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ADD "_createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "_updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "eventinstances" ADD "_createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "eventinstances" ADD "_updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "sensordata" ADD "_createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "sensordata" ADD "_updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "events" ADD "_createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "events" ADD "_updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" ADD "_createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" ADD "_updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "_createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "_updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" DROP CONSTRAINT "FK_3ddcde09c50781170c1fd329788"`);
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" ALTER COLUMN "eventId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "eventschedulertasks" ADD CONSTRAINT "FK_3ddcde09c50781170c1fd329788" FOREIGN KEY ("eventId") REFERENCES "events"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" DROP CONSTRAINT "FK_3ddcde09c50781170c1fd329788"`);
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" ALTER COLUMN "eventId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "eventschedulertasks" ADD CONSTRAINT "FK_3ddcde09c50781170c1fd329788" FOREIGN KEY ("eventId") REFERENCES "events"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "_updatedBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "_createdBy"`);
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" DROP COLUMN "_updatedBy"`);
        await queryRunner.query(`ALTER TABLE "eventschedulertasks" DROP COLUMN "_createdBy"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "_updatedBy"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "_createdBy"`);
        await queryRunner.query(`ALTER TABLE "sensordata" DROP COLUMN "_updatedBy"`);
        await queryRunner.query(`ALTER TABLE "sensordata" DROP COLUMN "_createdBy"`);
        await queryRunner.query(`ALTER TABLE "eventinstances" DROP COLUMN "_updatedBy"`);
        await queryRunner.query(`ALTER TABLE "eventinstances" DROP COLUMN "_createdBy"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "_updatedBy"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "_createdBy"`);
    }
}
