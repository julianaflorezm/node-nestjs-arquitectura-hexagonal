import { SinonStubbedInstance } from "sinon";
import { Usuario } from "src/dominio/usuario/modelo/usuario";
import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";
import { ServicioValidarCLave } from "src/dominio/usuario/servicio/servicio-validar-clave";
import { createStubObj } from "test/util/create-object.stub";
import crypto = require('crypto-js');

describe('ServicioValidarCLave', () => {

    let servicioValidarCLave: ServicioValidarCLave;
    let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;
  
    beforeEach(() => {
      repositorioUsuarioStub = createStubObj<RepositorioUsuario>(['existeNombreUsuario', 'obtenerContraseña']);
      servicioValidarCLave = new ServicioValidarCLave(repositorioUsuarioStub);
    });
  
    it('si el usuario no existe deberia retonar error', async () => {
  
      repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(false));
  
      await expect(
        servicioValidarCLave.ejecutar(
            Usuario.register('juan', '1234')
        ),
      ).rejects.toThrow(`El nombre de usuario juan no existe, regístrese primero.`);
    });
  
    it('si el usuario existe e ingresa una contraseña incorrecta genera error', async () => {
      const _Usuario = Usuario.register('juan', '1234');
      repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(true));
      repositorioUsuarioStub.obtenerContraseña.returns(Promise.resolve('445fgt5fv5'));

      await expect(
        servicioValidarCLave.ejecutar(_Usuario)
      ).rejects.toThrow(`La contraseña no es correcta`);
    });

    it('si el usuario existe e ingresa una contraseña correcta retorna verdadero', async () => {
        const _Usuario = Usuario.register('juan', '1234');
        const claveEncryptada = crypto.AES.encrypt('1234', 'secret').toString();
        repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(true));
        repositorioUsuarioStub.obtenerContraseña.returns(Promise.resolve(claveEncryptada));

        const respuesta = await servicioValidarCLave.ejecutar(_Usuario);
        expect(respuesta).toBeTruthy();
      });
  });
  