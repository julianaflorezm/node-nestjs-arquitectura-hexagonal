import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { ServicioValidarCLave } from 'src/dominio/usuario/servicio/servicio-validar-clave';

export function servicioValidarClaveProveedor(repositorioUsuario: RepositorioUsuario) {
    return new ServicioValidarCLave(repositorioUsuario);
}
