import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';

const SALDO_MINIMO = 50000;
export class Cuenta {
  public saldo: number;
  public usuarioId: number;

  constructor(saldo: number, usuarioId: number) {
    this.validarSaldoInicial(saldo);
    this.saldo = saldo;
    this.usuarioId = usuarioId;
  }

  private validarSaldoInicial(saldo: number) {
    if (saldo < SALDO_MINIMO) {
      throw new ErrorDeNegocio(
        `El saldo inicial debe ser no menor a ${SALDO_MINIMO}`,
      );
    }
  }

  // get saldo(): number {
  //   return this.saldo;
  // }

  // get usuarioId(): number {
  //   return this.usuarioId;
  // }
}
