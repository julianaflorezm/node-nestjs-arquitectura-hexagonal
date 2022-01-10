import { ApiProperty } from "@nestjs/swagger";

export class ConsultaListarTransaccionesPorCuenta {
    @ApiProperty({ example: 1 })
    public id: number;
  
    constructor(id: number) {
      this.id = id;
    }
}