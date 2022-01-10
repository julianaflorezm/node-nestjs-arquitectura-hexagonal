import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { esDiaHabil, generarFecha } from 'src/dominio/manejo-fechas/funciones-de-fecha';

const COSTO_HABITUAL_TRANSACCION = 1000;
const PORCENTAJE = 0.20;
const COSTO_DIA_NO_HABIL_TRANSACCION = COSTO_HABITUAL_TRANSACCION + (COSTO_HABITUAL_TRANSACCION * PORCENTAJE); // 20% more

export class Transaccion {
  readonly #id: number;
  readonly #valor: number;
  readonly #costo: number;
  readonly #esCuentaOrigen: boolean;
  readonly #cuenta: Cuenta;
  readonly #fechaCreacion: Date;
  readonly #fechaActualizacion: Date;

  constructor(id: number, valor: number, costo: number, esCuentaOrigen: boolean, cuenta: Cuenta, fechaCreacion: Date, fechaActualizacion: Date) {
    this.#id = id;
    this.#valor = valor;
    this.#costo = costo;
    this.#esCuentaOrigen = esCuentaOrigen;
    this.#cuenta = cuenta;
    this.#fechaCreacion = fechaCreacion;
    this.#fechaActualizacion = fechaActualizacion;
  }

  static crearTransaccion(valor: number, esCuentaOrigen: boolean, cuenta: Cuenta, fechaCreacion: Date) {
    this.cuentaExiste(esCuentaOrigen, cuenta);
    this.validarValor(valor);
    const costo = this.generarCosto(esCuentaOrigen, fechaCreacion);
    this.validarFondos(esCuentaOrigen, cuenta.saldo, valor, costo);
    valor = this.generarValor(valor, esCuentaOrigen);
    cuenta.actualizarSaldo(valor, costo);
    const id = 0;
    const fechaActualizacion = new Date('');
    return new this(id, valor, costo, esCuentaOrigen, cuenta, fechaCreacion, fechaActualizacion);
  }

  static cuentaExiste(esCuentaOrigen: boolean, cuenta: Cuenta) {
    if (!cuenta && esCuentaOrigen) {
      throw new ErrorDeNegocio(
        `La cuenta origen no existe`,
      );
    } else if (!cuenta && !esCuentaOrigen) {
      throw new ErrorDeNegocio(
        `La cuenta destino no existe`,
      );
    }
  }

  static validarFondos(esCuentaOrigen: boolean, saldo: number, valor: number, costo: number) {
    if(esCuentaOrigen && saldo - (valor + costo) < 0) {
      throw new ErrorDeNegocio('No tienes fondos suficientes para realizar la transacción.');
    }
  }

  static generarValor(valor: number, esCuentaOrigen: boolean) {
    if(esCuentaOrigen) {
      return - valor;
    }
    return valor;
  }

  static generarCosto(esCuentaOrigen: boolean, createdAt: Date) {
    const fechaCreacion = generarFecha(createdAt);
    if(!esCuentaOrigen) {
      return 0;
    }
    if(esCuentaOrigen && esDiaHabil(fechaCreacion)) {
      return COSTO_HABITUAL_TRANSACCION;
    }
    if(esCuentaOrigen && !esDiaHabil(fechaCreacion)) {
      return COSTO_DIA_NO_HABIL_TRANSACCION;
    }
  }
  
  static validarValor(valor: number) {
    if(valor <= 0) {
      throw new ErrorDeNegocio(
        `El valor de la transacción debe ser mayor a cero.`
      );
    }
  }

  get id(): number {
    return this.#id;
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

  get cuenta(): Cuenta {
    return this.#cuenta;
  }

  get fechaCreacion(): Date {
    return this.#fechaCreacion;
  }

  get fechaActualizacion(): Date {
    return this.#fechaActualizacion;
  }
}
