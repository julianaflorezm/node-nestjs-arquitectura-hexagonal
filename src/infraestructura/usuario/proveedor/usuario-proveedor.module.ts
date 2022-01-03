import { Module } from '@nestjs/common';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { servicioRegistrarUsuarioProveedor } from './servicio/servicio-registrar-usuario.proveedor';
import { repositorioUsuarioProvider } from './repositorio/repositorio-usuario.proveedor';
import { daoUsuarioProvider } from './dao/dao-usuario.proveedor';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../entidad/usuario.entidad';
import { ManejadorBuscarUsuario } from 'src/aplicacion/usuario/consulta/buscar-usuario.manejador';
import { ServicioBuscarUsuario } from 'src/dominio/usuario/servicio/servicio-buscar-usuario';
import { servicioBuscarUsuarioProveedor } from './servicio/servicio-buscar-usuario.proveedor';
import { ServicioValidarContraseña } from 'src/dominio/usuario/servicio/servicio-validar-contraseña';
import { servicioValidarContraseñaProveedor } from './servicio/servicio-validar-contraseña.proveedor';
import { ManejadorValidarContraseña } from 'src/aplicacion/usuario/consulta/validar-contraseña.manejador';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntidad])],
  providers: [
    { provide: ServicioRegistrarUsuario, inject: [RepositorioUsuario], useFactory: servicioRegistrarUsuarioProveedor },
    { provide: ServicioBuscarUsuario, inject: [RepositorioUsuario], useFactory: servicioBuscarUsuarioProveedor },
    { provide: ServicioValidarContraseña, inject: [RepositorioUsuario], useFactory: servicioValidarContraseñaProveedor },
    repositorioUsuarioProvider,
    daoUsuarioProvider,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
    ManejadorBuscarUsuario,
    ManejadorValidarContraseña
  ],
  exports: [
    ServicioRegistrarUsuario,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
    ServicioBuscarUsuario,
    ManejadorBuscarUsuario,
    ServicioValidarContraseña,
    ManejadorValidarContraseña,
    RepositorioUsuario,
    DaoUsuario,
  ],
})
export class UsuarioProveedorModule {

}
