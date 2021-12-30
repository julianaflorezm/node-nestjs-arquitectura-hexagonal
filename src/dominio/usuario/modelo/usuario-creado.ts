export class UsuarioCreado {
  readonly #id: number;
  readonly #nombre: string;
  readonly #clave: string;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;

  constructor(id: number, nombre: string, clave: string, createdAt: Date, updatedAt: Date) {
    this.#id = id;
    this.#nombre = nombre;
    this.#clave = clave;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
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

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }
}

