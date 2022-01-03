import {MigrationInterface, QueryRunner} from "typeorm";

export class MigracionCuenta1641228115765 implements MigrationInterface {
    name = 'MigracionCuenta1641228115765'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL DEFAULT 'Cuenta de ahorros', "numeroCuenta" character varying NOT NULL, "saldo" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "usuarioId" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_e4b175227700e30060291cb5aea" FOREIGN KEY ("usuarioId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_e4b175227700e30060291cb5aea"`, undefined);
        await queryRunner.query(`DROP TABLE "account"`, undefined);
    }

}
