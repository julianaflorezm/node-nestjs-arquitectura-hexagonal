import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { DaoCuenta } from "src/dominio/cuenta/puerto/dao/dao-cuenta";
import { EntityManager } from "typeorm";

@Injectable()
export class DaoCuentaPostgres implements DaoCuenta {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

}