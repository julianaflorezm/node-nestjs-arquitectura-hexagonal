import { UsuarioCreado } from 'src/dominio/usuario/modelo/usuario-creado';

describe('UsuarioCreado', () => {

  const _UsuarioCreado = UsuarioCreado as any;

  it('Debería crear bien un usuario', () => {
    const usuario = new _UsuarioCreado(1, 'juan', 'xxxxx', new Date('2022-01-01 11:59:00'), new Date('2022-01-01 11:59:00'));
 
    expect(usuario.id).toEqual(1);
    expect(usuario.nombre).toEqual('juan');
    expect(usuario.clave).toEqual('xxxxx');
  });
});
