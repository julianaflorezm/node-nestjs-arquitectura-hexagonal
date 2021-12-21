import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { ErrorLongitudInvalida } from "src/dominio/errores/error-longitud-invalida";
import { TRANSACCION_DESTINO, TRANSACCION_ORIGEN } from "src/infraestructura/utilidades/constantes-comunes";

const NUMERO_DIGITOS_CUENTA = 6;

export class Transaccion {
  public valor: number;
  public cuentaOrigen: number;
  public cuentaDestino: number;

  constructor(valor: number, cuentaOrigen: number, cuentaDestino: number) {
    this.valor = this.validarValor(valor);
    this.cuentaOrigen = this.validarNumeroDigitosCuenta(TRANSACCION_ORIGEN, cuentaOrigen);
    this.cuentaDestino = this.validarNumeroDigitosCuenta(TRANSACCION_DESTINO, cuentaDestino);
    this.validarIgualdad(cuentaOrigen, cuentaDestino);
  }

  private validarNumeroDigitosCuenta(tipo: string, cuenta: number) {
    if (cuenta.toString().length !== NUMERO_DIGITOS_CUENTA) {
      throw new ErrorLongitudInvalida(
        `El número de la ${tipo} debe tener ${NUMERO_DIGITOS_CUENTA} dígitos.`,
      );
    }
    return cuenta;
  }

  private validarValor(valor: number) {
    if(valor <= 0) {
      throw new ErrorDeNegocio(
        `El valor de la transacción debe ser mayor a cero.`,
      );
    }
    return valor;
  }

  private validarIgualdad(cuentaOrigen: number, cuentaDestino: number) {
    if(cuentaOrigen === cuentaDestino) {
      throw new ErrorDeNegocio(
        `La cuenta origen y la cuenta destino no deben ser iguales`,
      );
    }
  }
}
