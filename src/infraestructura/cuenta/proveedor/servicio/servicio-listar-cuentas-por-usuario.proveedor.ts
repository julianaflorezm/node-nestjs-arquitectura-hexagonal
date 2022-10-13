import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { ServicioListarCuentasPorUsuario } from 'src/dominio/cuenta/servicio/servicio-listar-cuentas-por-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';

export function servicioListarCuentasPorUsuarioProveedor(repositorioCuenta: RepositorioCuenta, repositorioUsuario: RepositorioUsuario) {
    return new ServicioListarCuentasPorUsuario(repositorioCuenta, repositorioUsuario);
}