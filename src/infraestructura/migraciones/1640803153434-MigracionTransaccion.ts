import {MigrationInterface, QueryRunner} from "typeorm";

export class MigracionTransaccion1640803153434 implements MigrationInterface {
    name = 'MigracionTransaccion1640803153434'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "esCuentaOrigen" boolean NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "esCuentaOrigen"`, undefined);
    }

}
