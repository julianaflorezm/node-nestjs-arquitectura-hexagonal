import { CuentaCreada } from 'src/dominio/cuenta/modelo/cuenta-creada';

export class TransaccionCreada {
  readonly #id: number;
  readonly #valor: number;
  readonly #costo: number;
  readonly #esCuentaOrigen: boolean;
  readonly #cuenta: CuentaCreada;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;

  constructor(id: number, valor: number, costo: number, esCuentaOrigen: boolean, cuenta: CuentaCreada, createdAt: Date, updatedAt: Date) {
    this.#id = id;
    this.#valor = valor;
    this.#costo = costo;
    this.#esCuentaOrigen = esCuentaOrigen;
    this.#cuenta = cuenta;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
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

  get cuenta(): CuentaCreada {
    return this.#cuenta;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }
}
