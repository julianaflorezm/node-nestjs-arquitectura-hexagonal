import { Injectable } from "@nestjs/common";
import { Cuenta } from "src/dominio/cuenta/modelo/cuenta";
import { ServicioCrearCuenta } from "src/dominio/cuenta/servicio/servicio-crear-cuenta";
import { CuentaDto } from "../consulta/dto/cuenta.dto";
import { ComandoCrearCuenta } from "./crear-cuenta.comando";

@Injectable()
export class ManejadorCrearCuenta {
  constructor(private _servicioCrarCuenta: ServicioCrearCuenta) {}

  async ejecutar(comandoCrearCuenta: ComandoCrearCuenta): Promise<CuentaDto> {
  
    return await this._servicioCrarCuenta.ejecutar(
      new Cuenta(
        comandoCrearCuenta.saldo,
        comandoCrearCuenta.usuarioId,
      ) //revisar
    );
  }
}