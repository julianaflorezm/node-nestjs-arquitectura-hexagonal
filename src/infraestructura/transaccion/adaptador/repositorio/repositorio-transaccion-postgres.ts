import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { TransaccionDto } from 'src/aplicacion/transaccion/consulta/dto/transaccion.dto';
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta';
import { Transaccion } from 'src/dominio/transaccion/modelo/transaccion';
import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { CuentaEntidad } from 'src/infraestructura/cuenta/entidad/cuenta.entidad';
import { Repository } from 'typeorm';
import { TransaccionEntidad } from '../../entidad/transaccion.entidad';

@Injectable()
export class RepositorioTransaccionPostgres implements RepositorioTransaccion {
  constructor(
      @InjectRepository(TransaccionEntidad)
      private readonly repositorioTransaccion: Repository<TransaccionEntidad>,
  ) {}

  async listarPorCuenta(id: number): Promise<TransaccionDto[]> {
    const transacciones = await this.repositorioTransaccion.find({ where: { cuenta: { id } }, relations: ['cuenta']});
    return transacciones.map(transaccion => {
      const transaccionDto = new TransaccionDto();
      transaccionDto.id = transaccion.id;
      transaccionDto.valor = parseFloat(transaccion.valor.toString());
      transaccionDto.costo = parseFloat(transaccion.costo.toString());
      transaccionDto.fechaCreacion = transaccion.fechaActualizacion.toUTCString();
      transaccionDto.esCuentaOrigen = transaccion.esCuentaOrigen;
      const cuenta = new CuentaDto();
      cuenta.nombre = transaccion.cuenta.nombre;
      transaccionDto.origen = cuenta;
      return transaccionDto;
    })
  }


    async realizarTransaccion(transaccion: Transaccion): Promise<Transaccion> {
        const transaccionEntidad = this.repositorioTransaccion.create(transaccion);
        const transaccionCreada = await this.repositorioTransaccion.save(transaccionEntidad);
        const cuentaEntidad = transaccionCreada.cuenta;
        const usuarioEntidad = cuentaEntidad.usuario;
        const usuario = new Usuario(usuarioEntidad.id, usuarioEntidad.nombre, usuarioEntidad.clave, usuarioEntidad.fecha_creacion, usuarioEntidad.fecha_actualizacion);
        const cuenta = new Cuenta(cuentaEntidad.id, cuentaEntidad.nombre, cuentaEntidad.numeroCuenta, cuentaEntidad.saldo, usuario, cuentaEntidad.fechaCreacion, cuentaEntidad.fechaActualizacion);
        return new Transaccion(
          transaccionCreada.id,
          transaccionCreada.valor,
          transaccionCreada.costo,
          transaccionCreada.esCuentaOrigen,
          cuenta,
          transaccionCreada.fechaCreacion,
          transaccionCreada.fechaActualizacion
        );
    }


}
