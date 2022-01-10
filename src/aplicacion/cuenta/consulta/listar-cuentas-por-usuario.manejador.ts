import { Injectable } from "@nestjs/common";
import { ServicioListarCuentasPorUsuario } from "src/dominio/cuenta/servicio/servicio-listar-cuentas-por-usuario";
import { CuentaDto } from "./dto/cuenta.dto";
import { ConsultaListarCuentasPorUsuario } from "./listar-cuentas-por-usuario.consulta";

@Injectable()
export class ManejadorListarCuentasPorUsuario {
  constructor(private _servicioListarCuentasPorUsuario: ServicioListarCuentasPorUsuario) {}

  async ejecutar(consultaListarCuentasPorUsuario: ConsultaListarCuentasPorUsuario): Promise<CuentaDto[]> {
    return await this._servicioListarCuentasPorUsuario.ejecutar(consultaListarCuentasPorUsuario.idUsuario);
  }
}
