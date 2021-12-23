import {MigrationInterface, QueryRunner} from 'typeorm';

export class MigracionTransaccion1640222996992 implements MigrationInterface {
    name = 'MigracionTransaccion1640222996992';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "valor" bigint NOT NULL, "costo" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "cuentaId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_b4bfabe2f337a791ed5b9f2767e" FOREIGN KEY ("cuentaId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_b4bfabe2f337a791ed5b9f2767e"`, undefined);
        await queryRunner.query(`DROP TABLE "transaction"`, undefined);
    }

}
