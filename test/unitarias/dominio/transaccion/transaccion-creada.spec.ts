import { TransaccionCreada } from 'src/dominio/transaccion/modelo/transaccion-creada';

describe('TransaccionCreada', () => {

  const _TransaccionCreada = TransaccionCreada as any;

  it('Debería crear bien un usuario', () => {
    const transaccion = new _TransaccionCreada(1, -1000, 1000, true, {}, new Date(), new Date());
 
    expect(transaccion.id).toEqual(1);
    expect(transaccion.esCuentaOrigen).toEqual(true);
    expect(transaccion.valor).toEqual(-1000);
  });
});
