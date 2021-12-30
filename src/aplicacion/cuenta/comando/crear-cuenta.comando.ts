import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ComandoCrearCuenta {
  @ApiProperty({ example: 3000 })
  public saldo: number;

  @IsInt()
  @ApiProperty({ example: 12 })
  public usuarioId: number;

  @ApiProperty({ type: Date })
  public createdAt: string;
}
