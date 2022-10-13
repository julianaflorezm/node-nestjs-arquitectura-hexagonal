import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { TransaccionDto } from 'src/aplicacion/transaccion/consulta/dto/transaccion.dto';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { Transaccion } from '../modelo/transaccion';
import { RepositorioTransaccion } from '../puerto/repositorio/repositorio-transaccion';

export class ServicioRealizarTransaccion {

    constructor(private readonly _repositorioTransaccion: RepositorioTransaccion,
      private readonly _repositorioCuenta: RepositorioCuenta) {
    }
  
    async ejecutar(transaccionOrigen: Transaccion, transaccionDestino: Transaccion): Promise<TransaccionDto>{

      if(transaccionOrigen.cuenta.numeroCuenta === transaccionDestino.cuenta.numeroCuenta) {
        throw new ErrorDeNegocio(
          `La cuenta origen y la cuenta destino no deben ser iguales`,
        );
      }
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

      const transaccion = new TransaccionDto();
      transaccion.id = transOrgCreada.id;
      transaccion.valor = transDesCreada.valor;
      transaccion.costo = transOrgCreada.costo;
      transaccion.fechaCreacion = transOrgCreada.fechaCreacion.toISOString();
      transaccion.origen = origen;
      transaccion.destino = destino;
      return transaccion;
    }
  }
