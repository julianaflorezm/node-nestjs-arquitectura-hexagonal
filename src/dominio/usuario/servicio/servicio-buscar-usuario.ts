import { RepositorioUsuario } from '../puerto/repositorio/repositorio-usuario';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';

export class ServicioBuscarUsuario {
  constructor(private readonly _repositorioUsuario: RepositorioUsuario) {
  }
  async ejecutar(id: number): Promise<UsuarioDto>{
    if (!await this._repositorioUsuario.existeUsuario(id)) {
        throw new ErrorDeNegocio(`El usuario no existe`);
    }
    const repositorio = await this._repositorioUsuario.buscarUsuario(id);
    return repositorio;
  }
}
