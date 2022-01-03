import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComandoRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.comando';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { ManejadorBuscarUsuario } from 'src/aplicacion/usuario/consulta/buscar-usuario.manejador';
import { ConsultaBuscarUsuario } from 'src/aplicacion/usuario/consulta/buscar-usuario.consulta';
import { ConsultaValidarContraseña } from 'src/aplicacion/usuario/consulta/validar-contraseña-consulta';
import { ManejadorValidarContraseña } from 'src/aplicacion/usuario/consulta/validar-contraseña.manejador';

@Controller('usuarios')
export class UsuarioControlador {
  constructor(
    private readonly _manejadorRegistrarUsuario: ManejadorRegistrarUsuario,
    private readonly _manejadorListarUsuario: ManejadorListarUsuario,
    private readonly _manejadorBuscarUsuario: ManejadorBuscarUsuario,
    private readonly _manejadorValidarContraseña: ManejadorValidarContraseña,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRegistrarUsuario: ComandoRegistrarUsuario): Promise<UsuarioDto> {
    return await this._manejadorRegistrarUsuario.ejecutar(comandoRegistrarUsuario);
  }

  @Get('all')
  async listar(): Promise<UsuarioDto[]> {
    return this._manejadorListarUsuario.ejecutar();
  }

  @Get(':id')
  async buscarUsuario(@Param('id') id: number): Promise<UsuarioDto> {
    const consulta = new ConsultaBuscarUsuario(id);
    return this._manejadorBuscarUsuario.ejecutar(consulta);
  }

  @Get()
  async validarContraseña(@Query('nombre') nombre: string, @Query('clave') clave: string): Promise<boolean> {
    const consulta = new ConsultaValidarContraseña(nombre, clave);
    return await this._manejadorValidarContraseña.ejecutar(consulta);
  }
}
