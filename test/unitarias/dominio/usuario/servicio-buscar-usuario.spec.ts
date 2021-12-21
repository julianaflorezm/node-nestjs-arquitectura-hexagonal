import { SinonStubbedInstance } from "sinon";
import { Usuario } from "src/dominio/usuario/modelo/usuario";
import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";
import { ServicioBuscarUsuario } from "src/dominio/usuario/servicio/servicio-buscar-usuario";
import { createStubObj } from "test/util/create-object.stub";

describe('ServicioBuscarUsuario', () => {

    let servicioBuscarUsuario: ServicioBuscarUsuario;
    let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;
  
    beforeEach(() => {
  
      repositorioUsuarioStub = createStubObj<RepositorioUsuario>(['existeUsuario', 'buscarUsuario']);
      servicioBuscarUsuario = new ServicioBuscarUsuario(repositorioUsuarioStub);
    });
  
    it('si el usuario no existe deberia retonar error', async () => {
  
      repositorioUsuarioStub.existeUsuario.returns(Promise.resolve(false));
  
      await expect(
        servicioBuscarUsuario.ejecutar(1),
      ).rejects.toThrow(`El usuario no existe`);
    });
  
    it('si el usuario existe lo busca en el repositorio', async () => {
      const id = 1;
      repositorioUsuarioStub.existeUsuario.returns(Promise.resolve(true));
  
      await servicioBuscarUsuario.ejecutar(id);
  
      expect(repositorioUsuarioStub.buscarUsuario.getCalls().length).toBe(1);
      expect(repositorioUsuarioStub.buscarUsuario.calledWith(id)).toBeTruthy();
    });
  });
  