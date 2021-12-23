import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { RepositorioTransaccionPostgres } from '../../adaptador/repositorio/repositorio-transaccion-postgres';

export const repositorioTransaccionProvider = {
    provide: RepositorioTransaccion,
    useClass: RepositorioTransaccionPostgres,
};
