import { DaoCuenta } from 'src/dominio/cuenta/puerto/dao/dao-cuenta';
import { DaoCuentaPostgres } from '../../adaptador/dao/dao-cuenta-postgres';

export const daoCuentaProvider = {
    provide: DaoCuenta,
    useClass: DaoCuentaPostgres,
};
