import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';
import crypto = require('crypto-js');
describe('Usuario', () => {

  const _Usuario = Usuario as any;

  it('usuario con clave menor a 4 dígitos debería retornar error', () => {
    return expect(async () => new _Usuario('juan', '12'))
      .rejects
      .toStrictEqual(new ErrorLongitudInvalida('El tamaño mínimo de la clave debe ser 4'));
  });

  it('usuario con clave igual a 4 dígitos debería crear bien', () => {
    const usuario = new _Usuario('juan', '4123');

    const bytes  = crypto.AES.decrypt(usuario.clave, 'secret');
    const clave = bytes.toString(crypto.enc.Utf8);
 

    expect(usuario.nombre).toEqual('juan');
    expect(clave).toEqual('4123');
  });
});
