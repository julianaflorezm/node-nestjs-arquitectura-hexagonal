import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { ServicioRealizarTransaccion } from 'src/dominio/transaccion/servicio/servicio-realizar-transaccion';

export function servicioRealizarTransaccionProveedor(repositorioTransaccion: RepositorioTransaccion, repositorioCuenta: RepositorioCuenta) {
    return new ServicioRealizarTransaccion(repositorioTransaccion, repositorioCuenta);
}
