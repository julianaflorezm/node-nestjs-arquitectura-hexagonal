import { SinonStubbedInstance } from "sinon";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";
import { createStubObj } from "test/util/create-object.stub";
import { ServicioListarCuentasPorUsuario } from "src/dominio/cuenta/servicio/servicio-listar-cuentas-por-usuario";

describe('ServicioListarCuentasPorUsuario', () => {

    let servicioListarCuentasPorUsuario: ServicioListarCuentasPorUsuario;
    let repositorioCuentaStub: SinonStubbedInstance<RepositorioCuenta>;
    let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;

  
    beforeEach(() => {
  
      repositorioCuentaStub = createStubObj<RepositorioCuenta>(['listarPorUsuario']);
      repositorioUsuarioStub = createStubObj<RepositorioUsuario>(['existeUsuario']);

      servicioListarCuentasPorUsuario = new ServicioListarCuentasPorUsuario(repositorioCuentaStub, repositorioUsuarioStub);
    });
  
  
    it('Si el usuario que va listar sus cuentas no existe, debe generar error', async () => {
        repositorioUsuarioStub.existeUsuario.returns(Promise.resolve(false));

        await expect(
            servicioListarCuentasPorUsuario.ejecutar(1),
        ).rejects.toThrow('El usuario no está registrado');
    });

    it('Si el usuario existe debería listar sus cuentas', async () => {
        const id = 1
        repositorioUsuarioStub.existeUsuario.returns(Promise.resolve(true));

        await servicioListarCuentasPorUsuario.ejecutar(id);
    
        expect(repositorioCuentaStub.listarPorUsuario.getCalls().length).toBe(1);
        expect(repositorioCuentaStub.listarPorUsuario.calledWith(id)).toBeTruthy();
      });
});
  