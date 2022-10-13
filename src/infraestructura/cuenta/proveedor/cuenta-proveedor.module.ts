import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManejadorCrearCuenta } from 'src/aplicacion/cuenta/comando/crear-cuenta.manejador';
import { ManejadorListarCuentasPorUsuario } from 'src/aplicacion/cuenta/consulta/listar-cuentas-por-usuario.manejador';
import { DaoCuenta } from 'src/dominio/cuenta/puerto/dao/dao-cuenta';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { ServicioCrearCuenta } from 'src/dominio/cuenta/servicio/servicio-crear-cuenta';
import { ServicioListarCuentasPorUsuario } from 'src/dominio/cuenta/servicio/servicio-listar-cuentas-por-usuario';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { daoUsuarioProvider } from 'src/infraestructura/usuario/proveedor/dao/dao-usuario.proveedor';
import { repositorioUsuarioProvider } from 'src/infraestructura/usuario/proveedor/repositorio/repositorio-usuario.proveedor';
import { CuentaEntidad } from '../entidad/cuenta.entidad';
import { daoCuentaProvider } from './dao/dao-cuenta.proveedor';
import { repositorioCuentaProvider } from './repositorio/repositorio-cuenta.proveedor';
import { servicioCrearCuentaProveedor } from './servicio/servicio-crear-cuenta.proveedor';
import { servicioListarCuentasPorUsuarioProveedor } from './servicio/servicio-listar-cuentas-por-usuario.proveedor';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaEntidad]), TypeOrmModule.forFeature([UsuarioEntidad])],
  providers: [
    { provide: ServicioCrearCuenta, inject: [RepositorioCuenta, RepositorioUsuario], useFactory: servicioCrearCuentaProveedor },
    { provide: ServicioListarCuentasPorUsuario, inject: [RepositorioCuenta, RepositorioUsuario], useFactory: servicioListarCuentasPorUsuarioProveedor },
    repositorioCuentaProvider,
    repositorioUsuarioProvider,
    daoCuentaProvider,
    daoUsuarioProvider,
    ManejadorCrearCuenta,
    ManejadorListarCuentasPorUsuario
  ],
  exports: [
    ServicioCrearCuenta,
    ManejadorCrearCuenta,
    ServicioListarCuentasPorUsuario,
    ManejadorListarCuentasPorUsuario,
    RepositorioCuenta,
    DaoCuenta,
  ],
})
export class CuentaProveedorModule {}
