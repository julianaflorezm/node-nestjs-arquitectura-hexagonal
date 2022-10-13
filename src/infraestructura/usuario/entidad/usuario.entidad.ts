import { CuentaEntidad } from 'src/infraestructura/cuenta/entidad/cuenta.entidad';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class UsuarioEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  clave: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  fecha_actualizacion: Date;

  @OneToMany(() => CuentaEntidad, cuenta => cuenta.usuario)
  cuentas: CuentaEntidad[];
}
