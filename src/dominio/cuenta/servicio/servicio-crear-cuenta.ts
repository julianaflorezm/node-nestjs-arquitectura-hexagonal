import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { canCreateAccount, getDateFormat } from 'src/infraestructura/utilidades/funciones-utiles';
import { Cuenta } from '../modelo/cuenta';
import { RepositorioCuenta } from '../puerto/repositorio/repositorio-cuenta';

export class ServicioCrearCuenta {

  constructor(private readonly _repositorioCuenta: RepositorioCuenta,
    private readonly _repositorioUsuario: RepositorioUsuario) {
  }

  async ejecutar(cuenta: Cuenta): Promise<CuentaDto>{
    if (!await this._repositorioUsuario.existeUsuario(cuenta.usuarioId)) {
        throw new ErrorDeNegocio(
          `El usuario no existe`,
        );
    }

    const date = getDateFormat(new Date());
    if(!canCreateAccount(date)) {
        throw new ErrorDeNegocio(
          `El horario para crear una cuenta los días no hábiles es de 8:00 a 12:00 am.`,
        );
    }
    const repositorio = await this._repositorioCuenta.crear(cuenta);
    return repositorio;
  }
}
