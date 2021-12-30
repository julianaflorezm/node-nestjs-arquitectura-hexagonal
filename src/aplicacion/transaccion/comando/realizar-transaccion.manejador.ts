import { Injectable } from '@nestjs/common';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { Transaccion } from 'src/dominio/transaccion/modelo/transaccion';
import { TransaccionCreada } from 'src/dominio/transaccion/modelo/transaccion-creada';
import { ServicioRealizarTransaccion } from 'src/dominio/transaccion/servicio/servicio-realizar-transaccion';
import { TransaccionDto } from '../consulta/dto/transaccion.dto';
import { ComandoRealizarTransaccion } from './realizar-transaccion.comando';

@Injectable()
export class ManejadorRealizarTransaccion {
  constructor(private _servicioRealizarTransaccion: ServicioRealizarTransaccion,
    private repositorioCuenta: RepositorioCuenta) {}

  async ejecutar(comandoRealizarTransaccion: ComandoRealizarTransaccion): Promise<TransaccionDto> {
    if (!await this.repositorioCuenta.existeNumeroCuenta(comandoRealizarTransaccion.cuentaOrigen)) {
      throw new ErrorDeNegocio(
        `La cuenta origen no existe.`,
      );
    }
    if (!await this.repositorioCuenta.existeNumeroCuenta(comandoRealizarTransaccion.cuentaDestino)) {
      throw new ErrorDeNegocio(
        `La cuenta destino no existe.`,
      );
    }

    return await this._servicioRealizarTransaccion.ejecutar(
      new Transaccion(
        comandoRealizarTransaccion.valor,
        true,
        await this.repositorioCuenta.buscar(comandoRealizarTransaccion.cuentaOrigen),
        new Date(comandoRealizarTransaccion.createdAt)
      ),
      new Transaccion(
        comandoRealizarTransaccion.valor,
        false,
        await this.repositorioCuenta.buscar(comandoRealizarTransaccion.cuentaDestino),
        new Date(comandoRealizarTransaccion.createdAt)
      ),
    );
  }
}
