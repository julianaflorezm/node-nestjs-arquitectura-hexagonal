import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { UsuarioCreado } from 'src/dominio/usuario/modelo/usuario-creado';
import { generarFecha, esDiaHabil } from 'src/infraestructura/utilidades/funciones-utiles';

const SALDO_MINIMO = 50000;
const NOMBRE_CUENTA = 'Cuenta de ahorros';
const CANTIDAD_CARACTERES_NUMERO_CUENTA = 8;
const FECHA_CREACION = generarFecha(new Date());
const HORARIO_CREACION_PERMITIDO = { INCIO: 8, FIN: 11 }

export class Cuenta {
  readonly #nombre: string;
  readonly #numeroCuenta: number;
  readonly #saldo: number;
  readonly #usuario: UsuarioCreado;

  constructor(saldo: number, usuario: UsuarioCreado) {
    this.puedeCrearCuenta();
    this.validarSaldoInicial(saldo);
    this.#nombre = this.generarNombre();
    this.#numeroCuenta = this.generarNumeroCuenta();
    this.#saldo = saldo;
    this.#usuario = usuario;
    
  }

  private puedeCrearCuenta() {
    if(!esDiaHabil(FECHA_CREACION)) {
      if(FECHA_CREACION.hour() < HORARIO_CREACION_PERMITIDO.INCIO || FECHA_CREACION.hour() > HORARIO_CREACION_PERMITIDO.FIN  ) {
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
    const base = 10;
    return Math.floor(Math.pow(base, CANTIDAD_CARACTERES_NUMERO_CUENTA - 1) + Math.random() * (Math.pow(base, CANTIDAD_CARACTERES_NUMERO_CUENTA) - Math.pow(base, CANTIDAD_CARACTERES_NUMERO_CUENTA - 1) - 1));
  }

  get nombre(): string {
    return this.#nombre;
  }

  get numeroCuenta(): number {
    return this.#numeroCuenta;
  }

  get saldo(): number {
    return this.#saldo;
  }

  get usuario(): UsuarioCreado {
    return this.#usuario;
  }
}
