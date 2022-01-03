/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { Repository } from 'typeorm';
import { CuentaEntidad } from '../../entidad/cuenta.entidad';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { CuentaCreada } from 'src/dominio/cuenta/modelo/cuenta-creada';
import { UsuarioCreado } from 'src/dominio/usuario/modelo/usuario-creado';

@Injectable()
export class RepositorioCuentaPostgres implements RepositorioCuenta {
  constructor(
    @InjectRepository(CuentaEntidad)
    private readonly repositorioCuenta: Repository<CuentaEntidad>
  ) {}
  
  async buscar(numeroCuenta: string): Promise<CuentaCreada> {
    const cuenta = await this.repositorioCuenta.findOne({ where: { numeroCuenta }, relations: ['usuario'] });
    const usuarioEntidad = cuenta.usuario;
    const usuario = new UsuarioCreado(usuarioEntidad.id, usuarioEntidad.nombre, usuarioEntidad.clave, usuarioEntidad.created_at, usuarioEntidad.updated_at);
    return new CuentaCreada(cuenta.id, cuenta.nombre, cuenta.numeroCuenta, cuenta.saldo, usuario, cuenta.createdAt, cuenta.updatedAt);
  }

  async actualizarSaldo(cuenta: CuentaCreada) {
    const cuentaEntidad = this.repositorioCuenta.create(cuenta);
    this.repositorioCuenta.merge(cuentaEntidad);
    await this.repositorioCuenta.save(cuentaEntidad);
  }
  
  async tieneFondos(numeroCuenta: string, valor: number): Promise<boolean> {
    return (await this.repositorioCuenta.findOne({ select: ['saldo'], where: { numeroCuenta }})).saldo - valor >= 0;
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
        cuentaDto.createdAt = cuentaCreada.createdAt.toUTCString();
        cuentaDto.updatedAt = cuentaCreada.updatedAt.toUTCString();
        const usuario = new UsuarioDto();
        usuario.id = cuentaCreada.usuario.id;
        usuario.nombre = cuentaCreada.usuario.nombre;
        cuentaDto.usuario = usuario;
        return cuentaDto;
    }

  
}
