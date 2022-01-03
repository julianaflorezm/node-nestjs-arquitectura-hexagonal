import { RepositorioUsuario } from '../puerto/repositorio/repositorio-usuario';
import { Usuario } from '../modelo/usuario';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

export class ServicioValidarContraseña {

  constructor(private readonly _repositorioUsuario: RepositorioUsuario) {
  }

  async ejecutar(usuario: Usuario): Promise<boolean>{
    if (!await this._repositorioUsuario.existeNombreUsuario(usuario.nombre)) {
      throw new ErrorDeNegocio(`El nombre de usuario ${usuario.nombre} no existe, regístrese primero.`);
    }
    const clave = await this._repositorioUsuario.obtenerContraseña(usuario.nombre);
    return usuario.validarClave(clave);
  }
}
