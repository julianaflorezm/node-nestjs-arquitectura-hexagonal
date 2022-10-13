import { Module } from '@nestjs/common';
import { CuentaControlador } from './controlador/cuenta.controlador';
import { CuentaProveedorModule } from './proveedor/cuenta-proveedor.module';

@Module({
    imports: [
      CuentaProveedorModule
    ],
    controllers: [CuentaControlador],
})
export class CuentaModule {}
