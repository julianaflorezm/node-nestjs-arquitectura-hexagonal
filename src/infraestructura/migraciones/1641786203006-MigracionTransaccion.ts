import {MigrationInterface, QueryRunner} from "typeorm";

export class MigracionTransaccion1641786203006 implements MigrationInterface {
    name = 'MigracionTransaccion1641786203006'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "createdAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "fechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fechaActualizacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fechaCreacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

}
