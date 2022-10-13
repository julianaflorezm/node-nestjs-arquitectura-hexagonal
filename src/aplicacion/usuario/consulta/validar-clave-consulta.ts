import { ApiProperty } from '@nestjs/swagger';

export class ConsultaValidarCLave {
  @ApiProperty({ example: 'alex' })
  public nombre: string;

  @ApiProperty({ example: 'xxxx' })
  public clave: string;

  constructor(nombre: string, clave: string) {
    this.nombre = nombre;
    this.clave = clave;
  }
}
