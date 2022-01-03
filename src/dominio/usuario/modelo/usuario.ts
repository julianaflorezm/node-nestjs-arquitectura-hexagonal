import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';
import crypto = require('crypto-js');
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';

const NUMERO_MINIMO_CARACTERES_CLAVE = 4;
export class Usuario {
  readonly #nombre: string;
  readonly #clave: string;

  constructor(nombre: string, clave: string) {
    this.validarTamanoClave(clave);
    this.#nombre = nombre.toLowerCase();
    this.#clave = this.encryptarClave(clave);   
  }

  private encryptarClave(clave: string) {
    return crypto.AES.encrypt(clave, 'secret').toString();
  }

  private validarTamanoClave(clave: string) {
    if (clave.length < NUMERO_MINIMO_CARACTERES_CLAVE) {
      throw new ErrorLongitudInvalida(
        `El tamaño mínimo de la clave debe ser ${NUMERO_MINIMO_CARACTERES_CLAVE}`,
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
  
  get nombre(): string {
    return this.#nombre;
  }

  get clave(): string {
    return this.#clave;
  }
}

