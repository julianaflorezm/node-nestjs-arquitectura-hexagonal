/* eslint-disable @typescript-eslint/camelcase */
import { SinonStubbedInstance } from "sinon";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { ServicioCrearCuenta } from "src/dominio/cuenta/servicio/servicio-crear-cuenta";
import { createStubObj } from "test/util/create-object.stub";
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta'; 

describe('ServicioCrearCuenta', () => {

    let servicioCrearCuenta: ServicioCrearCuenta;
    let repositorioCuentaStub: SinonStubbedInstance<RepositorioCuenta>;
  
    beforeEach(() => {
  
      repositorioCuentaStub = createStubObj<RepositorioCuenta>(['crear']);

      servicioCrearCuenta = new ServicioCrearCuenta(repositorioCuentaStub);
    });
  
  
      it('Debería crear una cuenta en el repositorio', async () => {
        const _Cuenta = Cuenta as any;
        const usuario = {
          id: 1,
          nombre: 'arturo',
          clave: 'xxxx',
          fecha_creacion: new Date('2022-01-01 11:59:00'),
          fecha_actualizacion: new Date('2022-01-01 11:59:00')
        }
        const cuenta = _Cuenta.crearCuenta(300000, 'Cuenta de ahorro', usuario, new Date('2022-01-01 11:59:00'));

        await servicioCrearCuenta.ejecutar(cuenta);
    
        expect(repositorioCuentaStub.crear.getCalls().length).toBe(1);
        expect(repositorioCuentaStub.crear.calledWith(cuenta)).toBeTruthy();
      });
});
  