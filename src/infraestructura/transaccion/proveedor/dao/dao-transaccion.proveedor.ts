import { DaoTransaccion } from "src/dominio/transaccion/puerto/dao/dao-transaccion";
import { DaoTransaccionPostgres } from "../../adaptador/dao/dao-transaccion-postgres";

export const daoTransaccionProvider = {
    provide: DaoTransaccion,
    useClass: DaoTransaccionPostgres,
};