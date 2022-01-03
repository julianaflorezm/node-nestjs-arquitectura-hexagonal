import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { UsuarioCreado } from 'src/dominio/usuario/modelo/usuario-creado';
import { generarFecha, esDiaHabil } from 'src/infraestructura/utilidades/funciones-utiles';

const SALDO_MINIMO = 50000;
const NOMBRE_CUENTA = 'Cuenta de ahorros';
const CANTIDAD_CARACTERES_NUMERO_CUENTA = 8;
const HORARIO_CREACION_PERMITIDO = { INCIO: 8, FIN: 11 }

export class Cuenta {
  readonly #nombre: string;
  readonly #numeroCuenta: string;
  readonly #saldo: number;
  readonly #usuario: UsuarioCreado;
  readonly #createdAt: Date;
  
  constructor(saldo: number, usuario: UsuarioCreado, createdAt: Date) {
    this.puedeCrearCuenta(createdAt);
    this.validarSaldoInicial(saldo);
    this.#nombre = this.generarNombre();
    this.#numeroCuenta = this.generarNumeroCuenta();
    this.#saldo = saldo;
    this.#usuario = usuario;
    this.#createdAt = createdAt;
  }

  private puedeCrearCuenta(createdAt: Date) {
    const fechaCreacion = generarFecha(createdAt);
    if(!esDiaHabil(fechaCreacion)) {
      if(fechaCreacion.hour() < HORARIO_CREACION_PERMITIDO.INCIO || fechaCreacion.hour() > HORARIO_CREACION_PERMITIDO.FIN  ) {
        throw new ErrorDeNegocio(
          `El horario para crear una cuenta los días no hábiles es de 8:00 am a 12:00 am.`
        );
      }
    }
  }

  private validarSaldoInicial(saldo: number) {
    if (saldo < SALDO_MINIMO) {
      throw new ErrorDeNegocio(
        `El saldo inicial debe ser no menor a ${SALDO_MINIMO}`,
      );
    }
  }

  private generarNombre() {
    return NOMBRE_CUENTA;
  }

  private generarNumeroCuenta() {
    return require('crypto').randomBytes(5).toString('hex');
  }

  get nombre(): string {
    return this.#nombre;
  }

  get numeroCuenta(): string {
    return this.#numeroCuenta;
  }

  get saldo(): number {
    return this.#saldo;
  }

  get usuario(): UsuarioCreado {
    return this.#usuario;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }
}
