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
  
    @ApiProperty({ example: true })
    esCuentaOrigen: boolean;

    @ApiProperty({ type: Date })
    fechaCreacion: string;

    @ApiProperty()
    origen: CuentaDto;
  
    @ApiProperty()
    destino: CuentaDto;

}
