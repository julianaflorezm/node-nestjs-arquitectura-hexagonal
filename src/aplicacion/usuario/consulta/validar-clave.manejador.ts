import { Injectable } from '@nestjs/common';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { ServicioValidarCLave } from 'src/dominio/usuario/servicio/servicio-validar-clave';
import { ConsultaValidarCLave } from './validar-clave-consulta';

@Injectable()
export class ManejadorValidarClave {
  constructor(private _servicioValidarContraseña: ServicioValidarCLave) {}

  async ejecutar(consultaValidarContraseña: ConsultaValidarCLave): Promise<boolean> {
    return await this._servicioValidarContraseña.ejecutar(
        new Usuario(
            consultaValidarContraseña.nombre,
            consultaValidarContraseña.clave
        )
    );
  }
}
