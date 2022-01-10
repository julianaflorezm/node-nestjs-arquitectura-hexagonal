import { TransaccionEntidad } from 'src/infraestructura/transaccion/entidad/transaccion.entidad';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'account' })
export class CuentaEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Cuenta de ahorro' })
  nombre: string;

  @Column()
  numeroCuenta: string;

  @Column({ type: 'bigint' })
  saldo: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  fechaCreacion: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  fechaActualizacion: Date;

  @ManyToOne(() => UsuarioEntidad, usuario => usuario.cuentas)
  usuario: UsuarioEntidad;

  @OneToMany(() => TransaccionEntidad, transaccion => transaccion.cuenta, { cascade: true })
  transacciones: TransaccionEntidad[];
}
