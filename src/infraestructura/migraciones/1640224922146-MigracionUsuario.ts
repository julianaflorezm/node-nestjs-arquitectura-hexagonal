import {MigrationInterface, QueryRunner} from 'typeorm';

export class MigracionUsuario1640224922146 implements MigrationInterface {
    name = 'MigracionUsuario1640224922146';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

}
