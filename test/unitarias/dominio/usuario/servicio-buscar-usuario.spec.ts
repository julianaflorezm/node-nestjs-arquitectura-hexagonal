import { SinonStubbedInstance } from "sinon";
import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";
import { ServicioBuscarUsuario } from "src/dominio/usuario/servicio/servicio-buscar-usuario";
import { createStubObj } from "test/util/create-object.stub";

describe('ServicioBuscarUsuario', () => {

    let servicioBuscarUsuario: ServicioBuscarUsuario;
    let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;
  
    beforeEach(() => {
      repositorioUsuarioStub = createStubObj<RepositorioUsuario>(['existeNombreUsuario', 'buscarUsuario']);
      servicioBuscarUsuario = new ServicioBuscarUsuario(repositorioUsuarioStub);
    });
  
    it('si el usuario no existe deberia retonar error', async () => {
  
      repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(false));
  
      await expect(
        servicioBuscarUsuario.ejecutar('juan'),
      ).rejects.toThrow(`No hay ningún usuario registrado con ese nombre`);
    });
  
    it('si el usuario existe lo busca en el repositorio', async () => {
      const nombre = 'juan';
      repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(true));
  
      await servicioBuscarUsuario.ejecutar(nombre);
  
      expect(repositorioUsuarioStub.buscarUsuario.getCalls().length).toBe(1);
      expect(repositorioUsuarioStub.buscarUsuario.calledWith(nombre)).toBeTruthy();
    });
  });
  