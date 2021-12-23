import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';

export class TransaccionDto {
    @IsInt()
    @ApiProperty({ example: 1 })
    id: number;
  
    @ApiProperty({ example: 234566 })
    valor: number;
  
    @ApiProperty({ example: 20000 })
    costo: number;
  
    @ApiProperty({ type: Date })
    createdAt: string;

    @ApiProperty()
    origen: CuentaDto;
  
    @ApiProperty()
    destino: CuentaDto;

    constructor(id: number, valor: number, costo: number, createdAt: string, origen: CuentaDto, destino: CuentaDto) {
        this.id = id;
        this.valor = valor;
        this.costo = costo;
        this.createdAt = createdAt;
        this.origen = origen;
        this.destino = destino;
        
    }

}