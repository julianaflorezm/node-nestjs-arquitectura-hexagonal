import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { Cuenta } from '../modelo/cuenta';
import { RepositorioCuenta } from '../puerto/repositorio/repositorio-cuenta';

export class ServicioCrearCuenta {

  constructor(private readonly _repositorioCuenta: RepositorioCuenta) {}

  async ejecutar(cuenta: Cuenta): Promise<CuentaDto>{
    return await this._repositorioCuenta.crear(cuenta);
  }
}
