import {MigrationInterface, QueryRunner} from "typeorm";

export class MigracionUsuario1641785216706 implements MigrationInterface {
    name = 'MigracionUsuario1641785216706'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fechaCreacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fechaActualizacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fecha_actualizacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fecha_creacion"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "fechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`, undefined);
    }

}
