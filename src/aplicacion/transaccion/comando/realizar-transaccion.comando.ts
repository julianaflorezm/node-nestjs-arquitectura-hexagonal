import { ApiProperty } from '@nestjs/swagger';

export class ComandoRealizarTransaccion {

  @ApiProperty({ example: 15600, required: true })
  public valor: number;

  @ApiProperty({ example: 156767, required: true })
  public cuentaOrigen: number;

  @ApiProperty({ example: 12344, required: true })
  public cuentaDestino: number;
}
