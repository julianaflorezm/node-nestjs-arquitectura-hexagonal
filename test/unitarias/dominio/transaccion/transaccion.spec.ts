import { CuentaCreada } from "src/dominio/cuenta/modelo/cuenta-creada";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { Transaccion } from "src/dominio/transaccion/modelo/transaccion";

describe('Transaccion', () => {

    const _Transaccion = Transaccion as any;
  
    it('si el valor de la transaccion de cuenta origen es igual a cero debería retornar error', () => {
      return expect(async () => new _Transaccion(0, true, {}))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El valor de la transacción debe ser mayor a cero.`));
    });
  
    it('si el valor de la transaccion de cuenta origen es menor a cero debería retornar error', () => {
      return expect(async () => new _Transaccion(-1000,  true, {}))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El valor de la transacción debe ser mayor a cero.`));
    });

    it('transaccion de cuenta origen con valor + costo mayor a su saldo debería generar error', () => {
      const _Cuenta = CuentaCreada as any;
      const cuenta = new _Cuenta(
        1,
        'Cuenta de ahorros',
        33333333,
        50000,
        {},
        new Date(),
        new Date()
      );
      return expect(async () => new _Transaccion(100000,  true, cuenta))
      .rejects
      .toStrictEqual(new ErrorDeNegocio(`No tienes fondos suficientes para realizar la transacción.`));
    });

    it('transaccion de cuenta origen con valor mayor a 0 y valor + costo menor o igual a su saldo, debería crearla bien', () => {
      const _Cuenta = CuentaCreada as any;
      const cuenta = new _Cuenta(
        1,
        'Cuenta de ahorros',
        33333333,
        50000,
        {},
        new Date(),
        new Date()
      );
      const transaccion = new _Transaccion(1000, true, cuenta);
      expect(transaccion.valor).toEqual(-1000);
      expect(transaccion.esCuentaOrigen).toEqual(true);
      expect(transaccion.costo).toEqual(1000 || 1200);
      expect(transaccion.cuenta.id).toEqual(1);
    });

  });