import { ApiProperty } from '@nestjs/swagger';

export class UsuarioDto {

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Wilzliam' })
  nombre: string;

  @ApiProperty({ type: Date })
  created_at: string;

  @ApiProperty({ type: Date })
  updated_at: string;
}
