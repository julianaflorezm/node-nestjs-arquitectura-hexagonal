import { SinonStubbedInstance } from "sinon";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { createStubObj } from "test/util/create-object.stub";
import { ServicioListarTransaccionesPorCuenta } from "src/dominio/transaccion/servicio/servicio-listar-transacciones-por-cuenta";
import { RepositorioTransaccion } from "src/dominio/transaccion/puerto/repositorio/repositorio-transaccion";

describe('ServicioListarTransaccionesPorCuenta', () => {

    let servicioListarTransaccionesPorCuenta: ServicioListarTransaccionesPorCuenta;
    let repositorioCuentaStub: SinonStubbedInstance<RepositorioCuenta>;
    let repositorioTransaccionStub: SinonStubbedInstance<RepositorioTransaccion>;

  
    beforeEach(() => {
  
      repositorioCuentaStub = createStubObj<RepositorioCuenta>(['existeCuenta']);
      repositorioTransaccionStub = createStubObj<RepositorioTransaccion>(['listarPorCuenta']);

      servicioListarTransaccionesPorCuenta = new ServicioListarTransaccionesPorCuenta(repositorioTransaccionStub, repositorioCuentaStub);
    });
  
  
    it('Si la cuenta que va listar sus transacciones no existe, debe generar error', async () => {
        repositorioCuentaStub.existeCuenta.returns(Promise.resolve(false));

        await expect(
            servicioListarTransaccionesPorCuenta.ejecutar(1),
        ).rejects.toThrow('La cuenta no existe.');
    });

    it('Si el usuario existe debería listar sus cuentas', async () => {
        const id = 1
        repositorioCuentaStub.existeCuenta.returns(Promise.resolve(true));

        await servicioListarTransaccionesPorCuenta.ejecutar(id);
    
        expect(repositorioTransaccionStub.listarPorCuenta.getCalls().length).toBe(1);
        expect(repositorioTransaccionStub.listarPorCuenta.calledWith(id)).toBeTruthy();
      });
});
  