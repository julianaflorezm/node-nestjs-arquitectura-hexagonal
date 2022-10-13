/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { Repository } from 'typeorm';
import { CuentaEntidad } from '../../entidad/cuenta.entidad';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';

@Injectable()
export class RepositorioCuentaPostgres implements RepositorioCuenta {
  constructor(
    @InjectRepository(CuentaEntidad)
    private readonly repositorioCuenta: Repository<CuentaEntidad>
  ) {}
  
  async existeCuenta(id: number): Promise<boolean> {
    return (await this.repositorioCuenta.count({ id })) > 0;
  }

  async listarPorUsuario(idUsuario: number): Promise<CuentaDto[]> {
    const cuentas = await this.repositorioCuenta.find({ where: { usuario: { id: idUsuario }}, relations: ['usuario']});
    return cuentas.map((cuentaEntidad) => {
      const cuentaDto = new CuentaDto();
        cuentaDto.id = cuentaEntidad.id;
        cuentaDto.nombre = cuentaEntidad.nombre;
        cuentaDto.numeroCuenta = cuentaEntidad.numeroCuenta;
        cuentaDto.saldo = parseFloat(cuentaEntidad.saldo.toString());
        cuentaDto.fechaCreacion = cuentaEntidad.fechaCreacion.toISOString();
        cuentaDto.fechaActualizacion = cuentaEntidad.fechaActualizacion.toISOString();
      return cuentaDto;
    });
  }
  
  async buscar(numeroCuenta: string): Promise<Cuenta> {
    const cuenta = await this.repositorioCuenta.findOne({ where: { numeroCuenta }, relations: ['usuario'] });
    if (!cuenta) {
      return null;
    }
    const usuarioEntidad = cuenta.usuario;
    const usuario = new Usuario(usuarioEntidad.id, usuarioEntidad.nombre, usuarioEntidad.clave, usuarioEntidad.fecha_creacion, usuarioEntidad.fecha_actualizacion);
    return new Cuenta(cuenta.id, cuenta.nombre, cuenta.numeroCuenta, parseFloat(cuenta.saldo.toString()), usuario, cuenta.fechaCreacion, cuenta.fechaActualizacion);
  }

  async actualizarSaldo(cuenta: Cuenta) {
    const cuentaEntidad = this.repositorioCuenta.create(cuenta);
    this.repositorioCuenta.merge(cuentaEntidad);
    await this.repositorioCuenta.save(cuentaEntidad);
  }

  async existeNumeroCuenta(numeroCuenta: string): Promise<boolean> {
    return (await this.repositorioCuenta.count({ numeroCuenta })) > 0;
  }

    async crear(cuenta: Cuenta): Promise<CuentaDto> {
        const cuentaEntidad = this.repositorioCuenta.create(cuenta);
        const cuentaCreada = await this.repositorioCuenta.save(cuentaEntidad);
        const cuentaDto = new CuentaDto();
        cuentaDto.id = cuentaCreada.id;
        cuentaDto.nombre = cuentaCreada.nombre;
        cuentaDto.numeroCuenta = cuentaCreada.numeroCuenta;
        cuentaDto.fechaCreacion = cuentaCreada.fechaCreacion.toISOString();
        cuentaDto.fechaActualizacion = cuentaCreada.fechaActualizacion.toISOString();
        const usuario = new UsuarioDto();
        usuario.id = cuentaCreada.usuario.id;
        usuario.nombre = cuentaCreada.usuario.nombre;
        cuentaDto.usuario = usuario;
        return cuentaDto;
    }

  
}
