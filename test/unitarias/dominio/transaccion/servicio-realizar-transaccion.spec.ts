import { SinonStubbedInstance } from "sinon";
import { CuentaDto } from "src/aplicacion/cuenta/consulta/dto/cuenta.dto";
import { TransaccionDto } from "src/aplicacion/transaccion/consulta/dto/transaccion.dto";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { Transaccion } from "src/dominio/transaccion/modelo/transaccion";
import { RepositorioTransaccion } from "src/dominio/transaccion/puerto/repositorio/repositorio-transaccion";
import { ServicioRealizarTransaccion } from "src/dominio/transaccion/servicio/servicio-realizar-transaccion";
import { TRANSACCION_DESTINO, TRANSACCION_ORIGEN } from "src/infraestructura/utilidades/constantes-comunes";
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
  
    it('si la cuenta no existe deberia retonar error', async () => {
  
        repositorioCuentaStub.existeNumeroCuenta.returns(Promise.resolve(false));
    
        await expect(
            servicioRealizarTransaccion.ejecutar(
            new Transaccion(
                5000,
                856364,
                248380
              )
          ),
        ).rejects.toThrow(`La cuenta origen no existe.` || `La cuenta destino no existe.`);
      });
  
      it('si la cuenta no tiene fondos suficientes deberia retonar error', async () => {
        repositorioCuentaStub.existeNumeroCuenta.returns(Promise.resolve(true));
        repositorioCuentaStub.tieneFondos.returns(Promise.resolve(false));
    
        await expect(
            servicioRealizarTransaccion.ejecutar(
            new Transaccion(
                5000,
                856364,
                248380
              )
          ),
        ).rejects.toThrow(`No tienes fondos suficientes para hacer esta transacción.`);
      });

      it('si la cuenta existe y tiene fondos suficientes realiza la transaccion en el repositorio', async () => {
        const transaccion = new Transaccion(
            5000,
            856364,
            248380
          );

        const origenDto = new CuentaDto();
        origenDto.id = 1;
        origenDto.nombre = 'Cuenta de ahorros';
        origenDto.numeroCuenta = 856364;
        const destinoDto = new CuentaDto();
        destinoDto.id = 2;
        destinoDto.nombre =  'Cuenta de ahorros';
        destinoDto.numeroCuenta = 248380;
          
        const transaccionDto = new TransaccionDto(
            1,
            5000,
            1000,
            '2021/01/02 13:00:00',
            origenDto,
            destinoDto
        );
        repositorioCuentaStub.existeNumeroCuenta.returns(Promise.resolve(true));
        repositorioCuentaStub.tieneFondos.returns(Promise.resolve(true));
        repositorioTransaccionStub.realizarTransaccion.resolves(transaccionDto);
        repositorioCuentaStub.actualizarSaldo.withArgs(TRANSACCION_ORIGEN, transaccionDto.origen.numeroCuenta, transaccionDto.valor, transaccionDto.costo).resolves();
        repositorioCuentaStub.actualizarSaldo.withArgs(TRANSACCION_DESTINO, transaccionDto.destino.numeroCuenta, transaccionDto.valor, transaccionDto.costo).resolves();

        await servicioRealizarTransaccion.ejecutar(transaccion);
           
            
        expect(repositorioTransaccionStub.realizarTransaccion.getCalls().length).toBe(1);
        expect(repositorioTransaccionStub.realizarTransaccion.calledWith(transaccion)).toBeTruthy();
    });
});
  