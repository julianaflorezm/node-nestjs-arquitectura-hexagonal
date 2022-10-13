import { Injectable } from '@nestjs/common';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { Transaccion } from 'src/dominio/transaccion/modelo/transaccion';
import { ServicioRealizarTransaccion } from 'src/dominio/transaccion/servicio/servicio-realizar-transaccion';
import { TransaccionDto } from '../consulta/dto/transaccion.dto';
import { ComandoRealizarTransaccion } from './realizar-transaccion.comando';

@Injectable()
export class ManejadorRealizarTransaccion {
  constructor(private _servicioRealizarTransaccion: ServicioRealizarTransaccion,
    private repositorioCuenta: RepositorioCuenta) {}

  async ejecutar(comandoRealizarTransaccion: ComandoRealizarTransaccion): Promise<TransaccionDto> {
    return await this._servicioRealizarTransaccion.ejecutar(
      Transaccion.crearTransaccion(
        comandoRealizarTransaccion.valor,
        true,
        await this.repositorioCuenta.buscar(comandoRealizarTransaccion.cuentaOrigen),
        new Date(comandoRealizarTransaccion.fechaCreacion)
      ),
      Transaccion.crearTransaccion(
        comandoRealizarTransaccion.valor,
        false,
        await this.repositorioCuenta.buscar(comandoRealizarTransaccion.cuentaDestino),
        new Date(comandoRealizarTransaccion.fechaCreacion)
      ),
    );
  }
}
