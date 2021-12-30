import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaCreada } from 'src/dominio/cuenta/modelo/cuenta-creada';
import { Transaccion } from 'src/dominio/transaccion/modelo/transaccion';
import { TransaccionCreada } from 'src/dominio/transaccion/modelo/transaccion-creada';
import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { UsuarioCreado } from 'src/dominio/usuario/modelo/usuario-creado';
import { CuentaEntidad } from 'src/infraestructura/cuenta/entidad/cuenta.entidad';
import { Repository } from 'typeorm';
import { TransaccionEntidad } from '../../entidad/transaccion.entidad';

@Injectable()
export class RepositorioTransaccionPostgres implements RepositorioTransaccion {
  constructor(
      @InjectRepository(TransaccionEntidad)
      private readonly repositorioTransaccion: Repository<TransaccionEntidad>,
      @InjectRepository(CuentaEntidad)
      private readonly repositorioCuenta: Repository<CuentaEntidad>,
  ) {}


    async realizarTransaccion(transaccion: Transaccion): Promise<TransaccionCreada> {
        const transaccionEntidad = this.repositorioTransaccion.create(transaccion);
        const transaccionCreada = await this.repositorioTransaccion.save(transaccionEntidad);
        const cuentaEntidad = transaccionCreada.cuenta;
        const usuarioEntidad = cuentaEntidad.usuario;
        const usuario = new UsuarioCreado(usuarioEntidad.id, usuarioEntidad.nombre, usuarioEntidad.clave, usuarioEntidad.created_at, usuarioEntidad.updated_at);
        const cuenta = new CuentaCreada(cuentaEntidad.id, cuentaEntidad.nombre, cuentaEntidad.numeroCuenta, cuentaEntidad.saldo, usuario, cuentaEntidad.createdAt, cuentaEntidad.updatedAt);
        return new TransaccionCreada(
          transaccionCreada.id,
          transaccionCreada.valor,
          transaccionCreada.costo,
          transaccionCreada.esCuentaOrigen,
          cuenta,
          transaccionCreada.createdAt,
          transaccionCreada.updatedAt
        );
    }


}
