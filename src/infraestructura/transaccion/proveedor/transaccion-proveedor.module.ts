import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManejadorRealizarTransaccion } from 'src/aplicacion/transaccion/comando/realizar-transaccion.manejador';
import { ManejadorListarTransaccionesPorCuenta } from 'src/aplicacion/transaccion/consulta/listar-transacciones-por-cuenta.manejador';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { DaoTransaccion } from 'src/dominio/transaccion/puerto/dao/dao-transaccion';
import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { ServicioListarTransaccionesPorCuenta } from 'src/dominio/transaccion/servicio/servicio-listar-transacciones-por-cuenta';
import { ServicioRealizarTransaccion } from 'src/dominio/transaccion/servicio/servicio-realizar-transaccion';
import { CuentaEntidad } from 'src/infraestructura/cuenta/entidad/cuenta.entidad';
import { daoCuentaProvider } from 'src/infraestructura/cuenta/proveedor/dao/dao-cuenta.proveedor';
import { repositorioCuentaProvider } from 'src/infraestructura/cuenta/proveedor/repositorio/repositorio-cuenta.proveedor';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { TransaccionEntidad } from '../entidad/transaccion.entidad';
import { daoTransaccionProvider } from './dao/dao-transaccion.proveedor';
import { repositorioTransaccionProvider } from './repositorio/repositorio-transaccion.proveedor';
import { servicioListarTransaccionesPorCuentaProveedor } from './servicio/servicio-listar-transacciones-por-cuenta';
import { servicioRealizarTransaccionProveedor } from './servicio/servicio-realizar-transaccion.proveedor';

@Module({
    imports: [TypeOrmModule.forFeature([TransaccionEntidad]), TypeOrmModule.forFeature([CuentaEntidad]), TypeOrmModule.forFeature([UsuarioEntidad])],
    providers: [
      { provide: ServicioRealizarTransaccion, inject: [RepositorioTransaccion,  RepositorioCuenta], useFactory: servicioRealizarTransaccionProveedor },
      { provide: ServicioListarTransaccionesPorCuenta, inject: [RepositorioTransaccion,  RepositorioCuenta], useFactory: servicioListarTransaccionesPorCuentaProveedor },
      repositorioTransaccionProvider,
      repositorioCuentaProvider,
      daoTransaccionProvider,
      daoCuentaProvider,
      ManejadorRealizarTransaccion,
      ManejadorListarTransaccionesPorCuenta
    ],
    exports: [
      ServicioRealizarTransaccion,
      ManejadorRealizarTransaccion,
      ServicioListarTransaccionesPorCuenta,
      ManejadorListarTransaccionesPorCuenta,
      RepositorioTransaccion,
      DaoTransaccion,
    ],
  })
  export class TransaccionProveedorModule {
  
}
