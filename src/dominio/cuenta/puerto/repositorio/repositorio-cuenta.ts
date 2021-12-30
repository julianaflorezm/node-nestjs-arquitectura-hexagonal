import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { Cuenta } from '../../modelo/cuenta';
import { CuentaCreada } from '../../modelo/cuenta-creada';

export abstract class RepositorioCuenta  {
    abstract async crear(cuenta: Cuenta): Promise<CuentaDto>;
    abstract async existeNumeroCuenta(numeroCuenta: number): Promise<boolean>;
    abstract async tieneFondos(cuentaId: number, valor: number): Promise<boolean>;
    abstract async actualizarSaldo(cuents: CuentaCreada);
    abstract async buscar(numeroCuenta: number): Promise<CuentaCreada>;
}
