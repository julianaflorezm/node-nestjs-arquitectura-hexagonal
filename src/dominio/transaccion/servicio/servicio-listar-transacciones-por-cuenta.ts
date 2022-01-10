import { TransaccionDto } from "src/aplicacion/transaccion/consulta/dto/transaccion.dto";
import { RepositorioCuenta } from "src/dominio/cuenta/puerto/repositorio/repositorio-cuenta";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { RepositorioTransaccion } from "../puerto/repositorio/repositorio-transaccion";

export class ServicioListarTransaccionesPorCuenta {

    constructor(private readonly _repositorioTransaccion: RepositorioTransaccion,
        private readonly _repositorioCuenta: RepositorioCuenta,
        ) {}
  
    async ejecutar(id: number): Promise<TransaccionDto[]>{
        if (!await this._repositorioCuenta.existeCuenta(id)) {
            throw new ErrorDeNegocio(
              `La cuenta no existe.`,
            );
        }
    
        return await this._repositorioTransaccion.listarPorCuenta(id);
    }
  }