import { Transaccion } from '../../modelo/transaccion';
import { TransaccionCreada } from '../../modelo/transaccion-creada';

export abstract class RepositorioTransaccion {
    abstract async realizarTransaccion(transaccion: Transaccion): Promise<TransaccionCreada>;
}
