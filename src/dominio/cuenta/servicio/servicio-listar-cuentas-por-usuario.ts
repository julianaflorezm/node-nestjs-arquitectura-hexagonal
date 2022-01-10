import { CuentaDto } from "src/aplicacion/cuenta/consulta/dto/cuenta.dto";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { RepositorioUsuario } from "src/dominio/usuario/puerto/repositorio/repositorio-usuario";
import { RepositorioCuenta } from "../puerto/repositorio/repositorio-cuenta";

export class ServicioListarCuentasPorUsuario {

    constructor(private readonly _repositorioCuenta: RepositorioCuenta,
        private readonly _repositorioUsuario: RepositorioUsuario) {}
  
    async ejecutar(idUsuario: number): Promise<CuentaDto[]>{
        if (!await this._repositorioUsuario.existeUsuario(idUsuario)) {
            throw new ErrorDeNegocio(
              `El usuario no está registrado`,
            );
        }
    
        return await this._repositorioCuenta.listarPorUsuario(idUsuario);
    }  
}
