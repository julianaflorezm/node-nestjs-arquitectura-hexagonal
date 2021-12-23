import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Repository } from 'typeorm';
import { CuentaEntidad } from '../../entidad/cuenta.entidad';
import { randomFixedInteger } from '../../../utilidades/funciones-utiles';
import { CANTIDAD_DIGITOS_NUMERO_CUENTA, TRANSACCION_ORIGEN } from 'src/infraestructura/utilidades/constantes-comunes';

@Injectable()
export class RepositorioCuentaPostgres implements RepositorioCuenta {
  constructor(
    @InjectRepository(CuentaEntidad)
    private readonly repositorioCuenta: Repository<CuentaEntidad>,
    @InjectRepository(UsuarioEntidad)
    private readonly repositorioUsuario: Repository<UsuarioEntidad>
  ) {}

  async actualizarSaldo(tipo: string, numeroCuenta: number, valor: number, costo: number) {
    const cuenta = await this.repositorioCuenta.findOne({ where: { numeroCuenta } });
    if(tipo === TRANSACCION_ORIGEN) {
      cuenta.saldo = cuenta.saldo - (valor + costo);
    } else {
      cuenta.saldo = cuenta.saldo + valor;
    }
    await this.repositorioCuenta.save(cuenta);
  }
  
  async tieneFondos(numeroCuenta: number, valor: number): Promise<boolean> {
    return (await this.repositorioCuenta.findOne({ select: ['saldo'], where: { numeroCuenta }})).saldo - valor >= 0;
  }

  async existeNumeroCuenta(numeroCuenta: number): Promise<boolean> {
    return (await this.repositorioCuenta.count({ numeroCuenta })) > 0;
  }

    async crear(cuenta: Cuenta): Promise<CuentaDto> {
        const cuentaEntidad = new CuentaEntidad();
        cuentaEntidad.numeroCuenta = randomFixedInteger(CANTIDAD_DIGITOS_NUMERO_CUENTA);
        cuentaEntidad.saldo = cuenta.saldo;
        const usuarioEntidad = await this.repositorioUsuario.findOne(cuenta.usuarioId);
        cuentaEntidad.usuario = usuarioEntidad;
        const cuentaCreada = await this.repositorioCuenta.save(cuentaEntidad);
        const cuentaDto = new CuentaDto();
        cuentaDto.id = cuentaCreada.id;
        cuentaDto.nombre = cuentaCreada.nombre;
        cuentaDto.numeroCuenta = cuentaCreada.numeroCuenta;
        cuentaDto.createdAt = cuentaCreada.createdAt.toUTCString();
        cuentaDto.createdAt = cuentaCreada.createdAt.toUTCString();
        cuentaDto.usuarioId = cuentaCreada.usuario.id;
        return cuentaDto;
    }

  
}
