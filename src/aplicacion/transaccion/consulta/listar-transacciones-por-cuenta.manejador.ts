import { Injectable } from "@nestjs/common";
import { ServicioListarTransaccionesPorCuenta } from "src/dominio/transaccion/servicio/servicio-listar-transacciones-por-cuenta";
import { TransaccionDto } from "./dto/transaccion.dto";
import { ConsultaListarTransaccionesPorCuenta } from "./listar-transacciones-por-cuenta.consulta";

@Injectable()
export class ManejadorListarTransaccionesPorCuenta {
  constructor(private _servicioListarTransaccionesPorCuenta: ServicioListarTransaccionesPorCuenta) {}

  async ejecutar(consultaListarTransaccionesPorCuenta: ConsultaListarTransaccionesPorCuenta): Promise<TransaccionDto[]> {
    return await this._servicioListarTransaccionesPorCuenta.ejecutar(consultaListarTransaccionesPorCuenta.id);
  }
}
