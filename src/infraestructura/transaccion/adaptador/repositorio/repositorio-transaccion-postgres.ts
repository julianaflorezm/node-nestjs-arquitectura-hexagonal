import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { TransaccionDto } from 'src/aplicacion/transaccion/consulta/dto/transaccion.dto';
import { Transaccion } from 'src/dominio/transaccion/modelo/transaccion';
import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { CuentaEntidad } from 'src/infraestructura/cuenta/entidad/cuenta.entidad';
import { COSTO_DIA_NO_HABIL_TRANSACCION, COSTO_HABITUAL_TRANSACCION, TRANSACCION_DESTINO, TRANSACCION_ORIGEN } from 'src/infraestructura/utilidades/constantes-comunes';
import { getDateFormat, isEnabledDay } from 'src/infraestructura/utilidades/funciones-utiles';
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


    async realizarTransaccion(transaccion: Transaccion): Promise<TransaccionDto> {
        const transaccionOrigen = await this.crearTransaccion(TRANSACCION_ORIGEN, transaccion);
        const trasaccionOrigenCreada = await this.repositorioTransaccion.save(transaccionOrigen);
        const cuentaOrigen = trasaccionOrigenCreada.cuenta;
        const transaccionDestino = await this.crearTransaccion(TRANSACCION_DESTINO, transaccion);
        const trasaccionDestinoCreada = await this.repositorioTransaccion.save(transaccionDestino);
        const cuentaDestino = trasaccionDestinoCreada.cuenta;
        const origenDto = new CuentaDto();
        origenDto.id = cuentaOrigen.id;
        origenDto.nombre = cuentaOrigen.nombre;
        origenDto.numeroCuenta = cuentaOrigen.numeroCuenta;
        const destinoDto = new CuentaDto();
        destinoDto.id = cuentaDestino.id;
        destinoDto.nombre = cuentaDestino.nombre;
        destinoDto.numeroCuenta = cuentaDestino.numeroCuenta;
        return new TransaccionDto(
          trasaccionOrigenCreada.id,
          trasaccionDestinoCreada.valor,
          trasaccionOrigenCreada.costo,
          trasaccionOrigenCreada.createdAt.toISOString(),
          origenDto,
          destinoDto
        );
    }

    async crearTransaccion(tipo: string, transaccion: Transaccion) {
      const transaccionEntidad = new TransaccionEntidad();
      const validacion = tipo === TRANSACCION_ORIGEN;
      transaccionEntidad.valor = validacion ? -transaccion.valor : transaccion.valor;
      const date = getDateFormat(new Date());
      if(validacion && isEnabledDay(date)) {
        transaccionEntidad.costo = COSTO_HABITUAL_TRANSACCION;
      } else if(validacion && !isEnabledDay(date)) {
        transaccionEntidad.costo = COSTO_DIA_NO_HABIL_TRANSACCION;
      } else {
        transaccionEntidad.costo = 0;
      }
      transaccionEntidad.cuenta = validacion ? await this.buscarCuenta(transaccion.cuentaOrigen) : await this.buscarCuenta(transaccion.cuentaDestino);
      return transaccionEntidad;
    }

    async buscarCuenta(numeroCuenta: number): Promise<CuentaEntidad> {
      return (await this.repositorioCuenta.findOne( { numeroCuenta }));
    }
}
