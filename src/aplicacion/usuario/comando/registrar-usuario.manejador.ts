import { Injectable } from '@nestjs/common';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { ComandoRegistrarUsuario } from './registrar-usuario.comando';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { UsuarioDto } from '../consulta/dto/usuario.dto';

@Injectable()
export class ManejadorRegistrarUsuario {
  constructor(private _servicioRegistrarUsuario: ServicioRegistrarUsuario) {}

  async ejecutar(comandoRegistrarUsuario: ComandoRegistrarUsuario): Promise<UsuarioDto> {
    return await this._servicioRegistrarUsuario.ejecutar(
      Usuario.register(
        comandoRegistrarUsuario.nombre,
        comandoRegistrarUsuario.clave,
      ),
    );
  }
}
