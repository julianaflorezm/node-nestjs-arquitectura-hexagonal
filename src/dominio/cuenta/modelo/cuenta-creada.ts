import { UsuarioCreado } from 'src/dominio/usuario/modelo/usuario-creado';

export class CuentaCreada {
  readonly #id: number;
  readonly #nombre: string;
  readonly #numeroCuenta: string;
  #saldo: number;
  readonly #usuario: UsuarioCreado;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;

  constructor(id: number, nombre: string, numeroCuenta: string, saldo: number, usuario: UsuarioCreado, createdAt: Date, updatedAt: Date) {
    this.#id = id;
    this.#nombre = nombre;
    this.#numeroCuenta = numeroCuenta;
    this.#saldo = saldo;
    this.#usuario = usuario;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  public actualizarSaldo(valor: number, costo: number) {
    this.#saldo = parseFloat(this.#saldo.toString()) + parseFloat(valor.toString()) - parseFloat(costo.toString());
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

  get usuario(): UsuarioCreado {
    return this.#usuario;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }
}
