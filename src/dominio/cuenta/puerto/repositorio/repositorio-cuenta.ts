import { CuentaDto } from "src/aplicacion/cuenta/consulta/dto/cuenta.dto";
import { Cuenta } from "../../modelo/cuenta";

export abstract class RepositorioCuenta  {
    abstract async crear(cuenta: Cuenta): Promise<CuentaDto>;
    abstract async existeNumeroCuenta(numeroCuenta: number): Promise<boolean>;
    abstract async tieneFondos(cuentaId: number, valor: number): Promise<boolean>;
    abstract async actualizarSaldo(tipo: string, numeroCuenta: number, valor: number, costo: number);
}