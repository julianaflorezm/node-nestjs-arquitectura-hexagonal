import { date } from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class ComandoRealizarTransaccion {

  @ApiProperty({ example: 15600, required: true })
  public valor: number;

  @ApiProperty({ example: 156767, required: true })
  public cuentaOrigen: string;

  @ApiProperty({ example: 12344, required: true })
  public cuentaDestino: string;

  @ApiProperty({ type: Date })
  public createdAt: Date;
}