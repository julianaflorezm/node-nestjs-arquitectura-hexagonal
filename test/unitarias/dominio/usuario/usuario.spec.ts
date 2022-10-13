import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';
import crypto = require('crypto-js');
describe('Usuario', () => {

  const _Usuario = Usuario as any;

  it('usuario con clave menor a 4 dígitos debería retornar error', () => {
    return expect(async () => _Usuario.register('juan', '12'))
      .rejects
      .toStrictEqual(new ErrorLongitudInvalida('El tamaño mínimo de la clave debe ser 4 caracteres'));
  });

  it('usuario con clave igual a 4 dígitos debería crear bien', () => {
    const usuario = _Usuario.register('juan', '4123');

    const bytes  = crypto.AES.decrypt(usuario.clave, 'secret');
    const clave = bytes.toString(crypto.enc.Utf8);
 

    expect(usuario.nombre).toEqual('juan');
    expect(clave).toEqual('4123');
  });

  it('si un usuario se registra con un nombre de usuario que contiene mayúsculas, debería crearlo todo en minúscula', () => {
    const usuario = _Usuario.register('JuAn', '4123');

    expect(usuario.nombre).toEqual('juan');
  });

  it('La clave del usuario es encryptada, por ende al crearlo, esta debe ser diferente a la clave ingresada por el usuario', () => {
    const usuario = _Usuario.register('JuAn', '4123');

    expect(usuario.clave === '4123').toBeFalsy();
  });

  it('El constructor de la clase debe crear un usuario con todos los atributos asignados', () => {

    const usuario = new _Usuario(1, 'juan', '23d56rf67vrf67', new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));

    expect(usuario.clave).toBe('23d56rf67vrf67');
    expect(usuario.nombre).toBe('juan');
    expect(usuario.id).toBe(1);
    expect(usuario.fecha_creacion).toEqual(new Date('2022-01-01 11:00:00'));
    expect(usuario.fecha_actualizacion).toEqual(new Date('2022-01-01 11:00:00'));
  });
});
