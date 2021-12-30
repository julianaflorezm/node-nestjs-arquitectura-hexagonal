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
    if (!await this.usuarioRepositorio.existeUsuario(comandoCrearCuenta.usuarioId)) {
      throw new ErrorDeNegocio(
        `El usuario no existe`,
      );
    }

    return await this._servicioCrarCuenta.ejecutar(
      new Cuenta(
        comandoCrearCuenta.saldo,
        await this.usuarioRepositorio.buscar(comandoCrearCuenta.usuarioId),
        new Date(comandoCrearCuenta.createdAt)
      )
    );
  }
}
