import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComandoCrearCuenta } from 'src/aplicacion/cuenta/comando/crear-cuenta.comando';
import { ManejadorCrearCuenta } from 'src/aplicacion/cuenta/comando/crear-cuenta.manejador';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';

@Controller('cuentas')
export class CuentaControlador {
  constructor(
    private readonly _manejadorCrearCuenta: ManejadorCrearCuenta,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoCrearCuenta: ComandoCrearCuenta): Promise<CuentaDto> {
    return await this._manejadorCrearCuenta.ejecutar(comandoCrearCuenta);
  }
}
