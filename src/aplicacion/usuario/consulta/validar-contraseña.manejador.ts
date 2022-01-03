import { Injectable } from "@nestjs/common";
import { Usuario } from "src/dominio/usuario/modelo/usuario";
import { ServicioValidarContraseña } from "src/dominio/usuario/servicio/servicio-validar-contraseña";
import { ConsultaValidarContraseña } from "./validar-contraseña-consulta";

@Injectable()
export class ManejadorValidarContraseña {
  constructor(private _servicioValidarContraseña: ServicioValidarContraseña) {}

  async ejecutar(consultaValidarContraseña: ConsultaValidarContraseña): Promise<boolean> {
    return await this._servicioValidarContraseña.ejecutar(
        new Usuario(
            consultaValidarContraseña.nombre,
            consultaValidarContraseña.contraseña
        )
    );
  }
}