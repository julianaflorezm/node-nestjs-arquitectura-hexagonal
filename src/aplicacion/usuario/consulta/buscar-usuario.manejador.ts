import { Injectable } from '@nestjs/common';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { ConsultaBuscarUsuario } from './buscar-usuario.consulta';
import { ServicioBuscarUsuario } from 'src/dominio/usuario/servicio/servicio-buscar-usuario';

@Injectable()
export class ManejadorBuscarUsuario {
  constructor(private _servicioBuscarUsuario: ServicioBuscarUsuario) {}

  async ejecutar(consultaBuscarUsuario: ConsultaBuscarUsuario): Promise<UsuarioDto> {
    return await this._servicioBuscarUsuario.ejecutar(consultaBuscarUsuario.id);
  }
}