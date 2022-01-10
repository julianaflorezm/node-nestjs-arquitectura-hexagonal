import { RepositorioUsuario } from '../puerto/repositorio/repositorio-usuario';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';

export class ServicioBuscarUsuario {
  constructor(private readonly _repositorioUsuario: RepositorioUsuario) {
  }
  async ejecutar(nombreUsuario: string): Promise<UsuarioDto>{
    if (!await this._repositorioUsuario.existeNombreUsuario(nombreUsuario)) {
        throw new ErrorDeNegocio(`No hay ningún usuario registrado con ese nombre`);
    }
    return await this._repositorioUsuario.buscarUsuario(nombreUsuario);
  }
}
