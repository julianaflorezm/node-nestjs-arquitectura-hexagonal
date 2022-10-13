import { ApiProperty } from '@nestjs/swagger';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';

export class UsuarioDto {

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Wilzliam' })
  nombre: string;

  @ApiProperty({ type: Date })
  fecha_creacion: string;

  @ApiProperty({ type: Date })
  fecha_actualizacion: string;

  @ApiProperty()
  cuentas: CuentaDto[]
}
