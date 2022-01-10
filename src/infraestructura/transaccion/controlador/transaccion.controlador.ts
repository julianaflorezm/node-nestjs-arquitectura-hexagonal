import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComandoRealizarTransaccion } from 'src/aplicacion/transaccion/comando/realizar-transaccion.comando';
import { ManejadorRealizarTransaccion } from 'src/aplicacion/transaccion/comando/realizar-transaccion.manejador';
import { TransaccionDto } from 'src/aplicacion/transaccion/consulta/dto/transaccion.dto';
import { ConsultaListarTransaccionesPorCuenta } from 'src/aplicacion/transaccion/consulta/listar-transacciones-por-cuenta.consulta';
import { ManejadorListarTransaccionesPorCuenta } from 'src/aplicacion/transaccion/consulta/listar-transacciones-por-cuenta.manejador';

@Controller('transacciones')
export class TransaccionControlador {
  constructor(
    private readonly _manejadorRealizarTransaccion: ManejadorRealizarTransaccion,
    private readonly _manejadorListarTransaccionesPorCuenta: ManejadorListarTransaccionesPorCuenta,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRealizarTransaccion: ComandoRealizarTransaccion): Promise<TransaccionDto> {
    return await this._manejadorRealizarTransaccion.ejecutar(comandoRealizarTransaccion);
  }

  @Get('por-cuenta')
  async listarPorCuenta(@Query('id') id: number): Promise<TransaccionDto[]> {
    const consulta = new ConsultaListarTransaccionesPorCuenta(id);
    return this._manejadorListarTransaccionesPorCuenta.ejecutar(consulta);
  }
}
