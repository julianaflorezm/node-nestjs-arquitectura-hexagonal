import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { ServicioCrearCuenta } from 'src/dominio/cuenta/servicio/servicio-crear-cuenta';

export function servicioCrearCuentaProveedor(repositorioCuenta: RepositorioCuenta) {
    return new ServicioCrearCuenta(repositorioCuenta);
}
