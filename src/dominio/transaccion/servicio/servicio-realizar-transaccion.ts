import { TransaccionDto } from "src/aplicacion/transaccion/consulta/dto/transaccion.dto";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { TRANSACCION_DESTINO, TRANSACCION_ORIGEN } from "src/infraestructura/utilidades/constantes-comunes";
import { Transaccion } from "../modelo/transaccion";
import { RepositorioTransaccion } from "../puerto/repositorio/repositorio-transaccion";

export class ServicioRealizarTransaccion {

    constructor(private readonly _repositorioTransaccion: RepositorioTransaccion,
      private readonly _repositorioCuenta: RepositorioCuenta) {
    }
  
    async ejecutar(transaccion: Transaccion): Promise<TransaccionDto>{
      if (!await this._repositorioCuenta.existeNumeroCuenta(transaccion.cuentaOrigen)) {
        throw new ErrorDeNegocio(
          `La cuenta origen no existe.`,
        );
      }
      if (!await this._repositorioCuenta.existeNumeroCuenta(transaccion.cuentaDestino)) {
        throw new ErrorDeNegocio(
          `La cuenta destino no existe.`,
        );
      }
      if(!await this._repositorioCuenta.tieneFondos(transaccion.cuentaOrigen, transaccion.valor)) {
        throw new ErrorDeNegocio(
          `No tienes fondos suficientes para hacer esta transacción.`,
        );
      }
     
      const response =  await this._repositorioTransaccion.realizarTransaccion(transaccion);
      await this._repositorioCuenta.actualizarSaldo(TRANSACCION_ORIGEN, response.origen.numeroCuenta, response.valor, response.costo);
      await this._repositorioCuenta.actualizarSaldo(TRANSACCION_DESTINO, response.destino.numeroCuenta, response.valor, response.costo);
      return response;
    }
  }
  