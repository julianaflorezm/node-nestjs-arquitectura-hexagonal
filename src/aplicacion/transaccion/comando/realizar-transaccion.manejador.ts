import { Injectable } from '@nestjs/common';
import { Transaccion } from 'src/dominio/transaccion/modelo/transaccion';
import { ServicioRealizarTransaccion } from 'src/dominio/transaccion/servicio/servicio-realizar-transaccion';
import { TransaccionDto } from '../consulta/dto/transaccion.dto';
import { ComandoRealizarTransaccion } from './realizar-transaccion.comando';

@Injectable()
export class ManejadorRealizarTransaccion {
  constructor(private _servicioRealizarTransaccion: ServicioRealizarTransaccion) {}

  async ejecutar(comandoRealizarTransaccion: ComandoRealizarTransaccion): Promise<TransaccionDto> {
    return await this._servicioRealizarTransaccion.ejecutar(
      new Transaccion(
        comandoRealizarTransaccion.valor,
        comandoRealizarTransaccion.cuentaOrigen,
        comandoRealizarTransaccion.cuentaDestino
      ),
    );
  }
}
