import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { ServicioCrearCuenta } from "src/dominio/cuenta/servicio/servicio-crear-cuenta";
import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";

export function servicioCrearCuentaProveedor(repositorioCuenta: RepositorioCuenta, repositorioUsuario: RepositorioUsuario) {
    return new ServicioCrearCuenta(repositorioCuenta, repositorioUsuario);
}