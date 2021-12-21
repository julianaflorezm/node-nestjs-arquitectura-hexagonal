import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ComandoRealizarTransaccion } from "src/aplicacion/transaccion/comando/realizar-transaccion.comando";
import { ManejadorRealizarTransaccion } from "src/aplicacion/transaccion/comando/realizar-transaccion.manejador";
import { TransaccionDto } from "src/aplicacion/transaccion/consulta/dto/transaccion.dto";

@Controller('transactions')
export class TransaccionControlador {
  constructor(
    private readonly _manejadorRealizarTransaccion: ManejadorRealizarTransaccion,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRealizarTransaccion: ComandoRealizarTransaccion): Promise<TransaccionDto> {
    return await this._manejadorRealizarTransaccion.ejecutar(comandoRealizarTransaccion);
  }
}