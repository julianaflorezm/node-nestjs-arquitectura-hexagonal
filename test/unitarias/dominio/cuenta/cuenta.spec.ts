/* eslint-disable @typescript-eslint/camelcase */
import { Cuenta } from "src/dominio/cuenta/modelo/cuenta";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";

describe('Cuenta', () => {

    const _Cuenta = Cuenta as any;
    const _Usuario = {
      id: 1,
      nombre: 'arturo',
      clave: 'xxxx',
      fecha_creacion: new Date('2022-01-01 11:59:00'),
      fecha_actualizacion: new Date('2022-01-01 11:59:00')
    };

     it('Si el usuario que va crear la cuenta no existe, genera error', () => {
      
      return expect(async () => _Cuenta.crearCuenta(300000, 'Cuenta de ahorro', null, new Date('2022-01-01 11:59:00')))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El usuario no está registrado`));
    });

    it('La cuenta con saldo inicial menor a 50000 debería retornar error', () => {

      return expect(async () => _Cuenta.crearCuenta(3000, 'Cuenta de ahorro', _Usuario, new Date('2022-01-01 11:59:00')))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El saldo inicial debe ser no menor a $50000`));
    });

    it('La cuenta creada un día no hábil fuera del horario establecido, debería retornar error', () => {

      return expect(async () => _Cuenta.crearCuenta(3000, 'Cuenta de ahorro', _Usuario, new Date('2022-01-01 02:59:00')))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El horario para crear una cuenta los días no hábiles es de 8:00 am a 12:00 am.`));
    });
  
    it('La cuenta creada con un usuario existente, en el horario establecido y con saldo inicial igual o mayor a 50000 debería crearla bien', () => {

      const cuenta = _Cuenta.crearCuenta(300000, 'Cuenta de ahorro', _Usuario, new Date('2022-01-01 11:59:00'));
  
      expect(cuenta.saldo).toEqual(300000);
      expect(cuenta.usuario.id).toEqual(1);
    });

    it('El constructor de la clase debe crear una cuenta con todos los atributos asignados', () => {

      const cuenta = new _Cuenta(1, 'Cuenta de ahorro', '12f4gh56hy', 50000, _Usuario, new Date('2022-01-01 11:00:00'), new Date('2022-01-01 11:00:00'));
  
      expect(cuenta.numeroCuenta).toBe('12f4gh56hy');
      expect(cuenta.nombre).toBe('Cuenta de ahorro');
      expect(cuenta.id).toBe(1);
      expect(cuenta.saldo).toBe(50000);
      expect(cuenta.fechaCreacion).toEqual(new Date('2022-01-01 11:00:00'));
      expect(cuenta.fechaActualizacion).toEqual(new Date('2022-01-01 11:00:00'));
      expect(cuenta.usuario.nombre).toBe('arturo');
    });

  });