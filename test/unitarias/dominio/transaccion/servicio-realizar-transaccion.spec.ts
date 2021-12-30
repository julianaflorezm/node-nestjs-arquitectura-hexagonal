import { SinonStubbedInstance } from "sinon";
import { CuentaCreada } from "src/dominio/cuenta/modelo/cuenta-creada";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { Transaccion } from "src/dominio/transaccion/modelo/transaccion";
import { TransaccionCreada } from "src/dominio/transaccion/modelo/transaccion-creada";
import { RepositorioTransaccion } from "src/dominio/transaccion/puerto/repositorio/repositorio-transaccion";
import { ServicioRealizarTransaccion } from "src/dominio/transaccion/servicio/servicio-realizar-transaccion";
import { UsuarioCreado } from "src/dominio/usuario/modelo/usuario-creado";
import { createStubObj } from "test/util/create-object.stub";

describe('ServicioRealizarTransaccion', () => {

    let servicioRealizarTransaccion: ServicioRealizarTransaccion;
    let repositorioTransaccionStub: SinonStubbedInstance<RepositorioTransaccion>;
    let repositorioCuentaStub: SinonStubbedInstance<RepositorioCuenta>;
  
    beforeEach(() => {
  
      repositorioTransaccionStub = createStubObj<RepositorioTransaccion>(['realizarTransaccion']);
      repositorioCuentaStub = createStubObj<RepositorioCuenta>(['existeNumeroCuenta', 'tieneFondos', 'actualizarSaldo']);

      servicioRealizarTransaccion = new ServicioRealizarTransaccion(repositorioTransaccionStub, repositorioCuentaStub);
    });
  
    it('Deberia crear las dos transacciones', async () => {
        const usuario = new UsuarioCreado(1, 'camila', 'xxxx', new Date(), new Date());
        const cuentaOrg = new CuentaCreada(1, 'Cuenta de ahorros', 12345678, 1000000, usuario, new Date(), new Date());
        const cuentaDes = new CuentaCreada(2, 'Cuenta de ahorros', 12345679, 100000, usuario, new Date(), new Date());
        const origen = new Transaccion(
            5000,
            true,
            cuentaOrg
        );

        const destino = new Transaccion(
            5000,
            false,
            cuentaDes
        );

        const transCreadaOrg = new TransaccionCreada(
          1,
          -5000,
          1000,
          true,
          cuentaOrg,
          new Date(),
          new Date()
        );

        const transCreadaDes = new TransaccionCreada(
            2,
            5000,
            0,
            false,
            cuentaDes,
            new Date(),
            new Date()
          );
        
        repositorioTransaccionStub.realizarTransaccion.returns(Promise.resolve(transCreadaDes));
        repositorioTransaccionStub.realizarTransaccion.returns(Promise.resolve(transCreadaOrg));
        repositorioCuentaStub.actualizarSaldo(cuentaOrg);
        repositorioCuentaStub.actualizarSaldo(cuentaDes);
        await servicioRealizarTransaccion.ejecutar(origen, destino);

        expect(repositorioTransaccionStub.realizarTransaccion.getCalls().length).toBe(2);
        expect(repositorioTransaccionStub.realizarTransaccion.calledWith(origen)).toBeTruthy();
        expect(repositorioTransaccionStub.realizarTransaccion.calledWith(destino)).toBeTruthy();
        expect(repositorioCuentaStub.actualizarSaldo.calledWith(cuentaOrg)).toBeTruthy();
        expect(repositorioCuentaStub.actualizarSaldo.calledWith(cuentaDes)).toBeTruthy();

      });
});
  