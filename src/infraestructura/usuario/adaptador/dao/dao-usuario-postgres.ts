import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

@Injectable()
export class DaoUsuarioPostgres implements DaoUsuario {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  buscarUsuario(nombreUsuario: string): Promise<UsuarioDto> {
     return this.entityManager.query(`SELECT id, nombre, fecha_creacion, fecha_actualizacion FROM public.user where nombre = '${nombreUsuario}'`);
  }

  async listar(): Promise<UsuarioDto[]> {
    return this.entityManager.query('SELECT id, nombre, fecha_creacion, fecha_actualizacion FROM public.user');
  }
}
