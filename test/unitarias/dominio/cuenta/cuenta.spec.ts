import { Cuenta } from "src/dominio/cuenta/modelo/cuenta";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";

describe('Cuenta', () => {

    const _Cuenta = Cuenta as any;
  
    it('La cuenta creada fuera del horario los días no hábiles, debería retornar error', () => {
      const usuario = {
        id: 1,
        nombre: 'arturo',
        clave: 'xxxx',
        createdAt: new Date('2022-01-01 11:59:00'),
        updatedAt: new Date('2022-01-01 11:59:00')
      }
      return expect(async () => new _Cuenta(3000, usuario, new Date('2022-01-01 13:00:00')))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El horario para crear una cuenta los días no hábiles es de 8:00 am a 12:00 am.`));
    });

    it('La cuenta con saldo inicial menor a 50000 debería retornar error', () => {
      const usuario = {
        id: 1,
        nombre: 'arturo',
        clave: 'xxxx',
        createdAt: new Date('2022-01-01 11:59:00'),
        updatedAt: new Date('2022-01-01 11:59:00')
      }
      return expect(async () => new _Cuenta(3000, usuario, new Date('2022-01-01 11:59:00')))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El saldo inicial debe ser no menor a 50000`));
    });
  
    it('La cuenta creada en el horario establecido y con saldo inicial igual o mayor a 50000 debería crearla bien', () => {
      const usuario = {
        id: 1,
        nombre: 'arturo',
        clave: 'xxxx',
        createdAt: new Date('2022-01-01 11:59:00'),
        updatedAt: new Date('2022-01-01 11:59:00')
      }

      const cuenta = new _Cuenta(300000, usuario, new Date('2022-01-01 11:59:00'));
  
      expect(cuenta.saldo).toEqual(300000);
      expect(cuenta.usuario.id).toEqual(1);
    });

  });