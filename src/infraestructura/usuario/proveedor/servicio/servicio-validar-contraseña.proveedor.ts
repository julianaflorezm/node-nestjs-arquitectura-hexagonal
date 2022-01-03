import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { ServicioValidarContraseña } from 'src/dominio/usuario/servicio/servicio-validar-contraseña';

export function servicioValidarContraseñaProveedor(repositorioUsuario: RepositorioUsuario) {
    return new ServicioValidarContraseña(repositorioUsuario);
}
