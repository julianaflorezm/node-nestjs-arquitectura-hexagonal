import { ApiProperty } from '@nestjs/swagger';

export class ComandoCrearCuenta {
  @ApiProperty({ example: 3000 })
  public saldo: number;

  @ApiProperty({ example: 3 })
  public idUsuario: number;

  @ApiProperty({ example: 'Javier' })
  public nombre: string;

  @ApiProperty({ type: Date })
  public fechaCreacion: string;
}
