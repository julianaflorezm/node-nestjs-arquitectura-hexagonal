import { CuentaCreada } from "src/dominio/cuenta/modelo/cuenta-creada";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { Transaccion } from "src/dominio/transaccion/modelo/transaccion";

describe('Transaccion', () => {

    const _Transaccion = Transaccion as any;
  
    it('si el valor de la transaccion de cuenta origen es igual a cero debería retornar error', () => {
      return expect(async () => new _Transaccion(0, true, {}, new Date('2022-01-01 02:00:00')))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El valor de la transacción debe ser mayor a cero.`));
    });
  
    it('si el valor de la transaccion de cuenta origen es menor a cero debería retornar error', () => {
      return expect(async () => new _Transaccion(-1000,  true, {},  new Date('2022-01-01 02:00:00')))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El valor de la transacción debe ser mayor a cero.`));
    });

    
    it('en una transaccion de cuenta origen el valor debería ser negativo', () => {
      const _Cuenta = CuentaCreada as any;
      const cuenta = new _Cuenta(
        1,
        'Cuenta de ahorros',
        33333333,
        50000,
        {},
        new Date('2022-01-01 11:00:00'),
        new Date('2022-01-01 11:00:00')
      );
      const transaccion = new _Transaccion(1000, true, cuenta, new Date('2022-01-01 02:00:00'));
      expect(transaccion.valor).toEqual(-1000);
    });

    it('en una transaccion de cuenta origen el valor debería ser positivo', () => {
      const _Cuenta = CuentaCreada as any;
      const cuenta = new _Cuenta(
        1,
        'Cuenta de ahorros',
        33333333,
        50000,
        {},
        new Date('2022-01-01 11:00:00'),
        new Date('2022-01-01 11:00:00')
      );
      const transaccion = new _Transaccion(1000, false, cuenta, new Date('2022-01-01 02:00:00'));
      expect(transaccion.valor).toEqual(1000);
    });

    it('en una transaccion de cuenta origen creada un dia no hábil, el costo debería ser 20% más al costo habitual', () => {
      const _Cuenta = CuentaCreada as any;
      const cuenta = new _Cuenta(
        1,
        'Cuenta de ahorros',
        33333333,
        50000,
        {},
        new Date('2022-01-01 11:00:00'),
        new Date('2022-01-01 11:00:00')
      );
      const transaccion = new _Transaccion(1000, true, cuenta, new Date('2022-01-01 02:00:00'));
      expect(transaccion.costo).toEqual(1000 + 1000 * 0.20);
    });

    it('en una transaccion de cuenta origen creada un dia hábil, el costo debería ser 1000', () => {
      const _Cuenta = CuentaCreada as any;
      const cuenta = new _Cuenta(
        1,
        'Cuenta de ahorros',
        33333333,
        50000,
        {},
        new Date('2022-01-01 11:00:00'),
        new Date('2022-01-01 11:00:00')
      );
      const transaccion = new _Transaccion(1000, true, cuenta, new Date('2022-02-02 02:00:00'));
      expect(transaccion.costo).toEqual(1000);
    });

    it('en una transaccion de cuenta destino, el costo debería ser 0', () => {
      const _Cuenta = CuentaCreada as any;
      const cuenta = new _Cuenta(
        1,
        'Cuenta de ahorros',
        33333333,
        50000,
        {},
        new Date('2022-01-01 11:00:00'),
        new Date('2022-01-01 11:00:00')
      );
      const transaccion = new _Transaccion(1000, false, cuenta, new Date('2022-01-01 02:00:00'));
      expect(transaccion.costo).toEqual(0);
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
      return expect(async () => new _Transaccion(100000,  true, cuenta, new Date('2022-01-01 02:00:00')))
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