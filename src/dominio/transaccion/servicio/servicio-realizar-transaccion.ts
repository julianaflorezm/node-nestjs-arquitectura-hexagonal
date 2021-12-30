import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { TransaccionDto } from 'src/aplicacion/transaccion/consulta/dto/transaccion.dto';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { Transaccion } from '../modelo/transaccion';
import { RepositorioTransaccion } from '../puerto/repositorio/repositorio-transaccion';

export class ServicioRealizarTransaccion {

    constructor(private readonly _repositorioTransaccion: RepositorioTransaccion,
      private readonly _repositorioCuenta: RepositorioCuenta) {
    }
  
    async ejecutar(transaccionOrigen: Transaccion, transaccionDestino: Transaccion): Promise<TransaccionDto>{
      const transOrgCreada = await this._repositorioTransaccion.realizarTransaccion(transaccionOrigen);
      const transDesCreada = await this._repositorioTransaccion.realizarTransaccion(transaccionDestino);
      const cuentaOrg = transOrgCreada.cuenta;
      const cuentaDes = transDesCreada.cuenta;
      await this._repositorioCuenta.actualizarSaldo(cuentaOrg);
      await this._repositorioCuenta.actualizarSaldo(cuentaDes);

      const origen = new CuentaDto();
      origen.id =  cuentaOrg.id;
      origen.nombre = cuentaOrg.nombre;
      origen.numeroCuenta = cuentaOrg.numeroCuenta;
      const usuarioOrg = new UsuarioDto();
      usuarioOrg.id = cuentaOrg.usuario.id;
      usuarioOrg.nombre = cuentaOrg.usuario.nombre;
      origen.usuario = usuarioOrg;

      const destino = new CuentaDto();
      destino.id =  cuentaDes.id;
      destino.nombre = cuentaDes.nombre;
      destino.numeroCuenta = cuentaDes.numeroCuenta;
      const usuarioDes = new UsuarioDto();
      usuarioDes.id = cuentaDes.usuario.id;
      usuarioDes.nombre = cuentaDes.usuario.nombre;
      destino.usuario = usuarioDes;

      return new TransaccionDto(
        transOrgCreada.id,
        transDesCreada.valor,
        transOrgCreada.costo,
        transOrgCreada.createdAt.toUTCString(),
        origen,
        destino,
      );
    }
  }
