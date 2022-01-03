import { ApiProperty } from '@nestjs/swagger';

export class ConsultaValidarContraseña {
  @ApiProperty({ example: 'alex' })
  public nombre: string;

  @ApiProperty({ example: 'xxxx' })
  public contraseña: string;

  constructor(nombre: string, contraseña: string) {
    this.nombre = nombre;
    this.contraseña = contraseña;
  }
}
