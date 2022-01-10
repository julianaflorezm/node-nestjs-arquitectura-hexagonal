/* eslint-disable @typescript-eslint/camelcase */
import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';
import crypto = require('crypto-js');
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';

const NUMERO_MINIMO_CARACTERES_CLAVE = 4;
export class Usuario {
  readonly #id: number;
  readonly #nombre: string;
  readonly #clave: string;
  readonly #fecha_creacion: Date;
  readonly #fecha_actualizacion: Date;

  constructor(id: number, nombre: string, clave: string, fecha_creacion: Date, fecha_actualizacion: Date) {
    this.#id = id;
    this.#nombre = nombre;
    this.#clave = clave;
    this.#fecha_creacion = fecha_creacion;
    this.#fecha_actualizacion = fecha_actualizacion;
  }

  static register(nombre: string, clave: string) {
    this.validarTamanoClave(clave);
    nombre = nombre.toLowerCase();
    clave = this.encryptarClave(clave);
    const id = 0;
    const fecha_creacion = new Date('');
    const fecha_actualizacion = new Date('');
    return new this(id, nombre, clave, fecha_creacion, fecha_actualizacion);
  }

  static encryptarClave(clave: string) {
    return crypto.AES.encrypt(clave, 'secret').toString();
  }

  static validarTamanoClave(clave: string) {
    if (clave.length < NUMERO_MINIMO_CARACTERES_CLAVE) {
      throw new ErrorLongitudInvalida(
        `El tamaño mínimo de la clave debe ser ${NUMERO_MINIMO_CARACTERES_CLAVE} caracteres`,
      );
    }
  }

  public validarClave(clave) {
    const bytes  = crypto.AES.decrypt(clave, 'secret');
    const decrypted = bytes.toString(crypto.enc.Utf8);

    const bytes2  = crypto.AES.decrypt(this.#clave, 'secret');
    const decrypted2 = bytes2.toString(crypto.enc.Utf8);
    
    if(decrypted !== decrypted2) {
      throw new ErrorDeNegocio(
        `La contraseña no es correcta`,
      );
    }
    return true;
  }
  
  get id(): number {
    return this.#id;
  }

  get nombre(): string {
    return this.#nombre;
  }

  get clave(): string {
    return this.#clave;
  }

  get fecha_creacion(): Date {
    return this.#fecha_creacion;
  }

  get fecha_actualizacion(): Date {
    return this.#fecha_actualizacion;
  }
}


