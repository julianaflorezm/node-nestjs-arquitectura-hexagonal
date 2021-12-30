import { Cuenta } from "src/dominio/cuenta/modelo/cuenta";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";

describe('Cuenta', () => {

    const _Cuenta = Cuenta as any;
  
    it('La cuenta con saldo inicial menor a 50000 debería retornar error', () => {
      const usuario = {
        id: 1,
        nombre: 'arturo',
        clave: 'xxxx',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return expect(async () => new _Cuenta(3000, usuario))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El saldo inicial debe ser no menor a 50000`));
    });
  
    it('La cuenta con saldo inicial igual o mayor a 50000 debería crearla bien', () => {
      const usuario = {
        id: 1,
        nombre: 'arturo',
        clave: 'xxxx',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const cuenta = new _Cuenta(300000, usuario);
  
      expect(cuenta.saldo).toEqual(300000);
      expect(cuenta.usuario.id).toEqual(1);
    });

  });