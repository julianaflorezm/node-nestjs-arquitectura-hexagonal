import { TransaccionDto } from 'src/aplicacion/transaccion/consulta/dto/transaccion.dto';
import { Transaccion } from '../../modelo/transaccion';

export abstract class RepositorioTransaccion {
    abstract async realizarTransaccion(transaccion: Transaccion): Promise<Transaccion>;
    abstract async listarPorCuenta(id: number): Promise<TransaccionDto[]>;
}
