import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CuentaDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ example: 'Cuenta ahorros' })
  nombre: string;

  @ApiProperty({ example: 23456678 })
  numeroCuenta: number;

  @ApiProperty({ type: Date })
  createdAt: string;

  @ApiProperty({ type: Date })
  updatedAt: string;

  @ApiProperty({ example: 1 })
  usuarioId: number;
}
