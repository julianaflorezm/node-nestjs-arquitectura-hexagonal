import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { RepositorioCuentaPostgres } from '../../adaptador/repositorio/repositorio-cuenta-postgres';

export const repositorioCuentaProvider = {
    provide: RepositorioCuenta,
    useClass: RepositorioCuentaPostgres,
};

  