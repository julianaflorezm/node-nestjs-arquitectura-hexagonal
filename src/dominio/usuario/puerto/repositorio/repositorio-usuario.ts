import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { Usuario } from '../../modelo/usuario';

export abstract class RepositorioUsuario {
  abstract async existeNombreUsuario(nombre: string): Promise<boolean>;
  abstract async existeUsuario(id: number): Promise<boolean>;
  abstract async guardar(usuario: Usuario): Promise<UsuarioDto>;
  abstract async buscarUsuario(nombreUsuario: string):  Promise<UsuarioDto>;
  abstract async buscar(idUsuario: number):  Promise<Usuario>;
  abstract async obtenerContraseña(nombre: string): Promise<string>;
}
