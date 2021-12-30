import { CuentaCreada } from 'src/dominio/cuenta/modelo/cuenta-creada';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { esDiaHabil, generarFecha } from 'src/infraestructura/utilidades/funciones-utiles';

const FECHA_CREACION = generarFecha(new Date());
const COSTO_HABITUAL_TRANSACCION = 1000;
const PORCENTAJE = 0.20;
const COSTO_DIA_NO_HABIL_TRANSACCION = COSTO_HABITUAL_TRANSACCION + (COSTO_HABITUAL_TRANSACCION * PORCENTAJE); // 20% more

export class Transaccion {
  readonly #valor: number;
  readonly #costo: number;
  readonly #esCuentaOrigen: boolean;
  readonly #cuenta: CuentaCreada;

  constructor(valor: number, esCuentaOrigen: boolean, cuenta: CuentaCreada) {
    this.validarValor(valor);
    this.#valor = this.generarValor(valor, esCuentaOrigen);
    this.#costo = this.generarCosto(esCuentaOrigen);
    this.#esCuentaOrigen = esCuentaOrigen;
    cuenta.actualizarSaldo(this.#valor, this.#costo);
    this.#cuenta = cuenta;
    this.validarFondos(valor);
  }

  private validarFondos(valor) {
    if(this.#esCuentaOrigen && this.#cuenta.saldo - (valor + this.#costo) < 0) {
      throw new ErrorDeNegocio('No tienes fondos suficientes para realizar la transacción.');
    }
  }

  private generarValor(valor: number, esCuentaOrigen: boolean) {
    if(esCuentaOrigen) {
      return - valor;
    }
    return valor;
  }

  private generarCosto(esCuentaOrigen: boolean) {
    if(!esCuentaOrigen) {
      return 0;
    }
    if(esCuentaOrigen && esDiaHabil(FECHA_CREACION)) {
      return COSTO_HABITUAL_TRANSACCION;
    }
    if(esCuentaOrigen && !esDiaHabil(FECHA_CREACION)) {
      return COSTO_DIA_NO_HABIL_TRANSACCION;
    }
  }
  
  private validarValor(valor: number) {
    if(valor <= 0) {
      throw new ErrorDeNegocio(
        `El valor de la transacción debe ser mayor a cero.`
      );
    }
  }

  get valor(): number {
    return this.#valor;
  }

  get costo(): number {
    return this.#costo;
  }

  get esCuentaOrigen(): boolean {
    return this.#esCuentaOrigen;
  }

  get cuenta(): CuentaCreada {
    return this.#cuenta;
  }

  // private validarNumeroDigitosCuenta(tipo: string, cuenta: number) {
  //   if (cuenta.toString().length !== NUMERO_DIGITOS_CUENTA) {
  //     throw new ErrorLongitudInvalida(
  //       `El número de la ${tipo} debe tener ${NUMERO_DIGITOS_CUENTA} dígitos.`,
  //     );
  //   }
  //   return cuenta;
  // }

 

  // private validarIgualdad(cuentaOrigen: number, cuentaDestino: number) {
  //   if(cuentaOrigen === cuentaDestino) {
  //     throw new ErrorDeNegocio(
  //       `La cuenta origen y la cuenta destino no deben ser iguales`,
  //     );
  //   }
  // }
}
