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

  buscarUsuario(id: number): Promise<UsuarioDto> {
     return this.entityManager.query(
      'SELECT id, nombre, created_at, updated_at FROM public.user where id = ' + id,
    );
  }

  async listar(): Promise<UsuarioDto[]> {
    return this.entityManager.query(
      'SELECT id, nombre, created_at, updated_at FROM public.user',
    );
  }

}
