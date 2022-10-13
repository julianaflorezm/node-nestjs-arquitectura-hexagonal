import { Module } from '@nestjs/common';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { servicioRegistrarUsuarioProveedor } from './servicio/servicio-registrar-usuario.proveedor';
import { repositorioUsuarioProvider } from './repositorio/repositorio-usuario.proveedor';
import { daoUsuarioProvider } from './dao/dao-usuario.proveedor';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../entidad/usuario.entidad';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntidad])],
  providers: [
    { provide: ServicioRegistrarUsuario, inject: [RepositorioUsuario], useFactory: servicioRegistrarUsuarioProveedor },
    repositorioUsuarioProvider,
    daoUsuarioProvider,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
  ],
  exports: [
    ServicioRegistrarUsuario,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
    RepositorioUsuario,
    DaoUsuario,
  ],
})
export class UsuarioProveedorModule {

}
