import { TransaccionEntidad } from 'src/infraestructura/transaccion/entidad/transaccion.entidad';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'account' })
export class CuentaEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Cuenta de ahorros' })
  nombre: string;

  @Column()
  numeroCuenta: number;

  @Column({ type: 'bigint' })
  saldo: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  @ManyToOne(() => UsuarioEntidad, usuario => usuario.cuentas)
  usuario: UsuarioEntidad;

  @OneToMany(() => TransaccionEntidad, transaccion => transaccion.cuenta, { cascade: true })
  transacciones: TransaccionEntidad[];
}
