import { CuentaEntidad } from 'src/infraestructura/cuenta/entidad/cuenta.entidad';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'transaction' })
export class TransaccionEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  valor: number;

  @Column({ type: 'bigint' })
  costo: number;

  @Column()
  esCuentaOrigen: boolean;
  
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  fechaCreacion: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  fechaActualizacion: Date;

  @ManyToOne(() => CuentaEntidad, cuenta => cuenta.transacciones)
  cuenta: CuentaEntidad;
}
