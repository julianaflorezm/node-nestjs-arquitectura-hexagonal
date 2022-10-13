import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComandoCrearCuenta } from 'src/aplicacion/cuenta/comando/crear-cuenta.comando';
import { ManejadorCrearCuenta } from 'src/aplicacion/cuenta/comando/crear-cuenta.manejador';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { ConsultaListarCuentasPorUsuario } from 'src/aplicacion/cuenta/consulta/listar-cuentas-por-usuario.consulta';
import { ManejadorListarCuentasPorUsuario } from 'src/aplicacion/cuenta/consulta/listar-cuentas-por-usuario.manejador';

@Controller('cuentas')
export class CuentaControlador {
  constructor(
    private readonly _manejadorCrearCuenta: ManejadorCrearCuenta,
    private readonly _ManejadorListarCuentasPorUsuario: ManejadorListarCuentasPorUsuario
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoCrearCuenta: ComandoCrearCuenta): Promise<CuentaDto> {
    return await this._manejadorCrearCuenta.ejecutar(comandoCrearCuenta);
  }

  @Get('por-usuario')
  async listarPorUsuario(@Query('idUsuario') idUsuario: number): Promise<CuentaDto[]> {
    const consulta = new ConsultaListarCuentasPorUsuario(idUsuario);
    return this._ManejadorListarCuentasPorUsuario.ejecutar(consulta);
  }
}
