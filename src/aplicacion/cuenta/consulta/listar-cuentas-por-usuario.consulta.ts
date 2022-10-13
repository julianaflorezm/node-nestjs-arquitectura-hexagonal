import { ApiProperty } from "@nestjs/swagger";

export class ConsultaListarCuentasPorUsuario {
    @ApiProperty({ example: 1 })
    public idUsuario: number;
  
    constructor(idUsuario: number) {
      this.idUsuario = idUsuario;
    }
}

  