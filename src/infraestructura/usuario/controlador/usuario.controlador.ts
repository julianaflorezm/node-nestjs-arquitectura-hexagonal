import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComandoRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.comando';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { ManejadorBuscarUsuario } from 'src/aplicacion/usuario/consulta/buscar-usuario.manejador';
import { ConsultaBuscarUsuario } from 'src/aplicacion/usuario/consulta/buscar-usuario.consulta';
import { ConsultaValidarCLave } from 'src/aplicacion/usuario/consulta/validar-clave-consulta';
import { ManejadorValidarClave } from 'src/aplicacion/usuario/consulta/validar-clave.manejador';

@Controller('usuarios')
export class UsuarioControlador {
  constructor(
    private readonly _manejadorRegistrarUsuario: ManejadorRegistrarUsuario,
    private readonly _manejadorListarUsuario: ManejadorListarUsuario,
    private readonly _manejadorBuscarUsuario: ManejadorBuscarUsuario,
    private readonly _manejadorValidarContraseña: ManejadorValidarClave,
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

  @Get()
  async buscarUsuario(@Query('nombreUsuario') nombreUsuario: string): Promise<UsuarioDto> {
    const consulta = new ConsultaBuscarUsuario(nombreUsuario);
    return this._manejadorBuscarUsuario.ejecutar(consulta);
  }

  @Get('validate-clave')
  async validarContraseña(@Query('nombre') nombre: string, @Query('clave') clave: string): Promise<boolean> {
    const consulta = new ConsultaValidarCLave(nombre, clave);
    return await this._manejadorValidarContraseña.ejecutar(consulta);
  }
}
