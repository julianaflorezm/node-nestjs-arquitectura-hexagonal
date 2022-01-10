import { Injectable } from '@nestjs/common';
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta';
import { ServicioCrearCuenta } from 'src/dominio/cuenta/servicio/servicio-crear-cuenta';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { CuentaDto } from '../consulta/dto/cuenta.dto';
import { ComandoCrearCuenta } from './crear-cuenta.comando';

@Injectable()
export class ManejadorCrearCuenta {
  constructor(private _servicioCrarCuenta: ServicioCrearCuenta, 
    private usuarioRepositorio: RepositorioUsuario) {}

  async ejecutar(comandoCrearCuenta: ComandoCrearCuenta): Promise<CuentaDto> {
    return await this._servicioCrarCuenta.ejecutar(
      Cuenta.crearCuenta(
        comandoCrearCuenta.saldo,
        comandoCrearCuenta.nombre,
        await this.usuarioRepositorio.buscar(comandoCrearCuenta.idUsuario),
        new Date(comandoCrearCuenta.fechaCreacion)
      )
    );
  }
}
