import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { generarFecha, esDiaHabil } from 'src/dominio/manejo-fechas/funciones-de-fecha';

const SALDO_MINIMO = 50000;
const CANTIDAD_BYTES = 5;
const HORARIO_CREACION_PERMITIDO = { INCIO: 8, FIN: 11 };

export class Cuenta {
  readonly #id: number;
  readonly #nombre: string;
  readonly #numeroCuenta: string;
  #saldo: number;
  readonly #usuario: Usuario;
  readonly #fechaCreacion: Date;
  readonly #fechaActualizacion: Date;

  constructor(id: number, nombre: string, numeroCuenta: string, saldo: number, usuario: Usuario, fechaCreacion: Date, fechaActualizacion: Date) {
    this.#id = id;
    this.#nombre = nombre;
    this.#numeroCuenta = numeroCuenta;
    this.#saldo = saldo;
    this.#usuario = usuario;
    this.#fechaCreacion = fechaCreacion;
    this.#fechaActualizacion = fechaActualizacion;
  }
  
  static crearCuenta(saldo: number, nombre: string, usuario: Usuario, createdAt: Date) {
    this.usuarioExiste(usuario);
    this.puedeCrearCuenta(createdAt);
    this.validarSaldoInicial(saldo);
    const id = 0;
    const numeroCuenta = this.generarNumeroCuenta();
    const updatedAt = new Date('');
    return new this(id, nombre, numeroCuenta, saldo, usuario, createdAt, updatedAt);
  }

  static puedeCrearCuenta(createdAt: Date) {
    const fechaCreacion = generarFecha(createdAt);
    if(!esDiaHabil(fechaCreacion)) {
      if(fechaCreacion.hour() < HORARIO_CREACION_PERMITIDO.INCIO || fechaCreacion.hour() > HORARIO_CREACION_PERMITIDO.FIN  ) {
        throw new ErrorDeNegocio(
          `El horario para crear una cuenta los días no hábiles es de 8:00 am a 12:00 am.`
        );
      }
    }
  }

  static usuarioExiste(usuario: Usuario) {
    if (!usuario) {
      throw new ErrorDeNegocio(
        `El usuario no está registrado`,
      );
    }
  }

  static validarSaldoInicial(saldo: number) {
    if (saldo < SALDO_MINIMO) {
      throw new ErrorDeNegocio(
        `El saldo inicial debe ser no menor a $${SALDO_MINIMO}`,
      );
    }
  }

  static generarNumeroCuenta() {
    return require('crypto').randomBytes(CANTIDAD_BYTES).toString('hex');
  }

  public actualizarSaldo(valor: number, costo: number) {
    this.#saldo = this.#saldo + valor - costo;
  }

  get id(): number {
    return this.#id;
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

  get usuario(): Usuario {
    return this.#usuario;
  }

  get fechaCreacion(): Date {
    return this.#fechaCreacion;
  }

  get fechaActualizacion(): Date {
    return this.#fechaActualizacion;
  }
}
