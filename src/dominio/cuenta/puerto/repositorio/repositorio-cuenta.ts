import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { Cuenta } from '../../modelo/cuenta';

export abstract class RepositorioCuenta  {
    abstract async crear(cuenta: Cuenta): Promise<CuentaDto>;
    abstract async existeNumeroCuenta(numeroCuenta: string): Promise<boolean>;
    abstract async actualizarSaldo(cuents: Cuenta);
    abstract async buscar(numeroCuenta: string): Promise<Cuenta>;
    abstract async listarPorUsuario(idUsuario: number): Promise<CuentaDto[]>;
    abstract async existeCuenta(id: number): Promise<boolean>;
}
