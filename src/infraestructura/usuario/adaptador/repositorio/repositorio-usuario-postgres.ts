/* eslint-disable @typescript-eslint/camelcase */
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../../entidad/usuario.entidad';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';

@Injectable()
export class RepositorioUsuarioPostgres implements RepositorioUsuario {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly repositorio: Repository<UsuarioEntidad>,
    private _daoUsuario: DaoUsuario,
  ) {}

  async existeUsuario(id: number): Promise<boolean> {
    return (await this.repositorio.count({ id })) > 0;
  }

  buscarUsuario(id: number): Promise<UsuarioDto> {
    return this._daoUsuario.buscarUsuario(id);
  }

  async existeNombreUsuario(nombre: string): Promise<boolean> {
    return (await this.repositorio.count({ nombre })) > 0;
  }

  async guardar(usuario: Usuario): Promise<UsuarioDto> {
    const entidad = new UsuarioEntidad();
    entidad.clave = usuario.clave;
    entidad.nombre = usuario.nombre;
    const user = await this.repositorio.save(entidad);
    const userCreated = new UsuarioDto();
    userCreated.id = user.id;
    userCreated.nombre = user.nombre;
    userCreated.created_at = user.created_at.toUTCString();
    userCreated.created_at = user.updated_at.toUTCString();
    return userCreated;
  }
}
