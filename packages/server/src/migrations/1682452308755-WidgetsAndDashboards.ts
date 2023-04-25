import { MigrationInterface, QueryRunner } from "typeorm";

export class WidgetsAndDashboards1682452308755 implements MigrationInterface {
    name = 'WidgetsAndDashboards1682452308755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dashboards" ("_id" SERIAL NOT NULL, "_version" integer NOT NULL, "_createdBy" integer, "_updatedBy" integer, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "displayName" text NOT NULL, "index" integer NOT NULL, "layout" jsonb NOT NULL, CONSTRAINT "PK_8e96801b7b800ca390d7279a8fd" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "widgets" ("_id" SERIAL NOT NULL, "_version" integer NOT NULL, "_createdBy" integer, "_updatedBy" integer, "_createdAt" TIMESTAMP NOT NULL DEFAULT now(), "_updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "displayName" text NOT NULL, "icon" text NOT NULL, CONSTRAINT "PK_d1f2f013190202c554d7457bffe" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "widgets"`);
        await queryRunner.query(`DROP TABLE "dashboards"`);
    }

}
