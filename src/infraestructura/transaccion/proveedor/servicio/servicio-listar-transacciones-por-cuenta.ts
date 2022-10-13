import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { ServicioListarTransaccionesPorCuenta } from 'src/dominio/transaccion/servicio/servicio-listar-transacciones-por-cuenta';

export function servicioListarTransaccionesPorCuentaProveedor(repositorioTransaccion: RepositorioTransaccion, repositorioCuenta: RepositorioCuenta) {
    return new ServicioListarTransaccionesPorCuenta(repositorioTransaccion, repositorioCuenta);
}