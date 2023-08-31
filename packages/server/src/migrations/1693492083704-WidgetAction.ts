import { MigrationInterface, QueryRunner } from 'typeorm';

export class WidgetAction1693492083704 implements MigrationInterface {
    name = 'WidgetAction1693492083704';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "widgets" ADD "action" jsonb DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "widgets" DROP COLUMN "action"`);
    }
}
