import { RepositorioUsuario } from '../puerto/repositorio/repositorio-usuario';
import { Usuario } from '../modelo/usuario';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

export class ServicioRegistrarUsuario {

  constructor(private readonly _repositorioUsuario: RepositorioUsuario) {
  }

  async ejecutar(usuario: Usuario): Promise<UsuarioDto>{
    if (await this._repositorioUsuario.existeNombreUsuario(usuario.nombre)) {
      throw new ErrorDeNegocio(`El nombre de usuario ${usuario.nombre} ya existe`);
    }
    return await this._repositorioUsuario.guardar(usuario);
  }
}
