import { ApiProperty } from '@nestjs/swagger';

export class ConsultaBuscarUsuario {
  @ApiProperty({ example: 1 })
  public id: number;

  constructor(id: number) {
    this.id = id;
  }
}
