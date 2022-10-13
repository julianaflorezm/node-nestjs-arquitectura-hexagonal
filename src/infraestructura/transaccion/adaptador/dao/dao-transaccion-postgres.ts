import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DaoTransaccion } from 'src/dominio/transaccion/puerto/dao/dao-transaccion';
import { EntityManager } from 'typeorm';

@Injectable()
export class DaoTransaccionPostgres implements DaoTransaccion {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

}
