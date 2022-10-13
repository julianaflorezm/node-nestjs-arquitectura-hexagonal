import { ApiProperty } from '@nestjs/swagger';

export class ConsultaBuscarUsuario {
  @ApiProperty({ example: 'Carmen' })
  public nombreUsuario: string;

  constructor(nombreUsuario: string) {
    this.nombreUsuario = nombreUsuario;
  }
}
