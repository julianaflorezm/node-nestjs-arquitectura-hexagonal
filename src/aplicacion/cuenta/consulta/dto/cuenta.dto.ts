import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

export class CuentaDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ example: 'Cuenta ahorros' })
  nombre: string;

  @ApiProperty({ example: 23456678 })
  numeroCuenta: string;

  @ApiProperty({ type: Date })
  createdAt: string;

  @ApiProperty({ type: Date })
  updatedAt: string;

  @ApiProperty({ example: 1 })
  usuario: UsuarioDto;
}
