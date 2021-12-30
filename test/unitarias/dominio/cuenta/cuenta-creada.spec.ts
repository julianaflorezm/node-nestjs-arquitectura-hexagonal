import { CuentaCreada } from 'src/dominio/cuenta/modelo/cuenta-creada';

describe('CuentaCreada', () => {

  const _CuentaCreada = CuentaCreada as any;

  it('Debería crear bien un usuario', () => {
    const cuenta = new _CuentaCreada(1, 'Cuenta de ahorros', 12345678, 1000, {}, new Date('2022-01-01 11:59:00'), new Date('2022-01-01 11:59:00'));
 
    expect(cuenta.id).toEqual(1);
    expect(cuenta.nombre).toEqual('Cuenta de ahorros');
    expect(cuenta.numeroCuenta).toEqual(12345678);
  });
});
