import { SinonStubbedInstance } from "sinon";
import { Cuenta } from "src/dominio/cuenta/modelo/cuenta";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { Transaccion } from "src/dominio/transaccion/modelo/transaccion";
import { RepositorioTransaccion } from "src/dominio/transaccion/puerto/repositorio/repositorio-transaccion";
import { ServicioRealizarTransaccion } from "src/dominio/transaccion/servicio/servicio-realizar-transaccion";
import { Usuario } from "src/dominio/usuario/modelo/usuario";
import { createStubObj } from "test/util/create-object.stub";

describe('ServicioRealizarTransaccion', () => {

    let servicioRealizarTransaccion: ServicioRealizarTransaccion;
    let repositorioTransaccionStub: SinonStubbedInstance<RepositorioTransaccion>;
    let repositorioCuentaStub: SinonStubbedInstance<RepositorioCuenta>;
  
    beforeEach(() => {
  
      repositorioTransaccionStub = createStubObj<RepositorioTransaccion>(['realizarTransaccion']);
      repositorioCuentaStub = createStubObj<RepositorioCuenta>(['existeNumeroCuenta', 'actualizarSaldo']);

      servicioRealizarTransaccion = new ServicioRealizarTransaccion(repositorioTransaccionStub, repositorioCuentaStub);
    });

    it('Si la cuenta de origen es igual a la de destino, debe generar error', async () => {
      const usuario = new Usuario(1, 'camila', 'xxxx', new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));
      const cuentaOrg = new Cuenta(1, 'Cuenta de ahorros', '12345678', 1000000, usuario, new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));
      const cuentaDes = new Cuenta(2, 'Cuenta de ahorros', '12345678', 100000, usuario, new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));
      const origen = Transaccion.crearTransaccion(
        5000,
        true,
        cuentaOrg,
        new Date('2022-01-01 11:00:00')
      );

      const destino = Transaccion.crearTransaccion(
          5000,
          false,
          cuentaDes,
          new Date('2022-01-01 11:00:00')
      );
      await expect(
        servicioRealizarTransaccion.ejecutar(origen, destino)
      ).rejects.toThrow(`La cuenta origen y la cuenta destino no deben ser iguales`);
    });
  
    it('Deberia crear las dos transacciones', async () => {
        const usuario = new Usuario(1, 'camila', 'xxxx', new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));
        const cuentaOrg = new Cuenta(1, 'Cuenta de ahorros', '12345678', 1000000, usuario, new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));
        const cuentaDes = new Cuenta(2, 'Cuenta de ahorros', '12345679', 100000, usuario, new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));
        const origen = Transaccion.crearTransaccion(
            5000,
            true,
            cuentaOrg,
            new Date('2022-01-01 11:00:00')
        );

        const destino = Transaccion.crearTransaccion(
            5000,
            false,
            cuentaDes,
            new Date('2022-01-01 11:00:00')
        );

        const transCreadaOrg = new Transaccion(
          1,
          -5000,
          1000,
          true,
          cuentaOrg,
          new Date('2022-01-01 11:00:00'),
          new Date('2022-01-01 11:00:00')
        );

        const transCreadaDes = new Transaccion(
            2,
            5000,
            0,
            false,
            cuentaDes,
            new Date('2022-01-01 11:00:00'),
            new Date('2022-01-01 11:00:00')
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
  