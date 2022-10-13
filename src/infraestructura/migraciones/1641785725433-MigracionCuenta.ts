import {MigrationInterface, QueryRunner} from "typeorm";

export class MigracionCuenta1641785725433 implements MigrationInterface {
    name = 'MigracionCuenta1641785725433'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "createdAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "fechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "fechaActualizacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "fechaCreacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

}
