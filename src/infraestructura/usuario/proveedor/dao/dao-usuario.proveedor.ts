import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { DaoUsuarioPostgres } from 'src/infraestructura/usuario/adaptador/dao/dao-usuario-postgres';

export const daoUsuarioProvider = {
  provide: DaoUsuario,
  useClass: DaoUsuarioPostgres,
};
