import { Module } from '@nestjs/common';
import { TransaccionControlador } from './controlador/transaccion.controlador';
import { TransaccionProveedorModule } from './proveedor/transaccion-proveedor.module';

@Module({
  imports: [
    TransaccionProveedorModule
  ],
  controllers: [TransaccionControlador],
})
export class TransaccionModule {}
