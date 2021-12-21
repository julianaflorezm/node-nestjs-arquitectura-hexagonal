import { SinonStubbedInstance } from "sinon";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { ServicioCrearCuenta } from "src/dominio/cuenta/servicio/servicio-crear-cuenta";
import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";
import { createStubObj } from "test/util/create-object.stub";
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta'; 

describe('ServicioCrearCuenta', () => {

    let servicioCrearCuenta: ServicioCrearCuenta;
    let repositorioCuentaStub: SinonStubbedInstance<RepositorioCuenta>;
    let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;
  
    beforeEach(() => {
  
      repositorioCuentaStub = createStubObj<RepositorioCuenta>(['crear']);
      repositorioUsuarioStub = createStubObj<RepositorioUsuario>(['existeUsuario']);

      servicioCrearCuenta = new ServicioCrearCuenta(repositorioCuentaStub, repositorioUsuarioStub);
    });
  
    it('si el usuario no existe deberia retonar error', async () => {
  
        repositorioUsuarioStub.existeUsuario.returns(Promise.resolve(false));
    
        await expect(
          servicioCrearCuenta.ejecutar(
            new Cuenta(
                300000,
                1,
              )
          ),
        ).rejects.toThrow(`El usuario no existe`);
      });
  
      it('si el usuario existe crea una cuenta en el repositorio', async () => {
        const cuenta = new Cuenta(
            300000,
            1,
          );
        repositorioUsuarioStub.existeUsuario.returns(Promise.resolve(true));

        await servicioCrearCuenta.ejecutar(cuenta);
    
        expect(repositorioCuentaStub.crear.getCalls().length).toBe(1);
        expect(repositorioCuentaStub.crear.calledWith(cuenta)).toBeTruthy();
      });
});
  