import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";
import { ServicioBuscarUsuario } from "src/dominio/usuario/servicio/servicio-buscar-usuario";

export function servicioBuscarUsuarioProveedor(repositorioUsuario: RepositorioUsuario) {
    return new ServicioBuscarUsuario(repositorioUsuario);
}