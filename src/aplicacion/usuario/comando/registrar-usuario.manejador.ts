import { Injectable } from '@nestjs/common';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { ComandoRegistrarUsuario } from './registrar-usuario.comando';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { UsuarioDto } from '../consulta/dto/usuario.dto';

@Injectable()
export class ManejadorRegistrarUsuario {
  constructor(private _servicioRegistrarUsuario: ServicioRegistrarUsuario) {}

  async ejecutar(comandoRegistrarUsuario: ComandoRegistrarUsuario): Promise<UsuarioDto> {
    const servicio = await this._servicioRegistrarUsuario.ejecutar(
      new Usuario(
        comandoRegistrarUsuario.nombre,
        comandoRegistrarUsuario.clave,
      ),
    );
    return servicio;
  }
}
