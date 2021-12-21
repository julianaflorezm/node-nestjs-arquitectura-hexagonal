import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { ErrorLongitudInvalida } from "src/dominio/errores/error-longitud-invalida";
import { Transaccion } from "src/dominio/transaccion/modelo/transaccion";

describe('Transaccion', () => {

    const _Transaccion = Transaccion as any;
  
    it('si el valor de la transaccion es igual a cero debería retornar error', () => {
      return expect(async () => new _Transaccion(0, 123456, 678900))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`El valor de la transacción debe ser mayor a cero.`));
    });
  
    it('si el valor de la transaccion es menor a cero debería retornar error', () => {
        return expect(async () => new _Transaccion(-1000, 123456, 678900))
          .rejects
          .toStrictEqual(new ErrorDeNegocio(`El valor de la transacción debe ser mayor a cero.`));
      });

    it('transaccion con valor mayor a 0 debería crearla bien', () => {
      const transaccion = new _Transaccion(1000, 123456, 678900);
  
      expect(transaccion.valor).toEqual(1000);
      expect(transaccion.cuentaOrigen).toEqual(123456);
      expect(transaccion.cuentaDestino).toEqual(678900);

    });

    it('transacción con número de cuenta de origen sin 6 dígitos debería retornar error', () => { 
        return expect(async () => new _Transaccion(1000, 12345, 678900))
          .rejects
          .toStrictEqual(new ErrorLongitudInvalida(`El número de la cuenta origen debe tener 6 dígitos.`));
      });

    it('transacción con número de cuenta de destino sin 6 dígitos debería retornar error', () => {
        return expect(async () => new _Transaccion(1000, 123456, 67890))
          .rejects
          .toStrictEqual(new ErrorLongitudInvalida(`El número de la cuenta destino debe tener 6 dígitos.`));
    });

    it('transacción con número de cuenta de origen igual a cuenta destino debería retornar error', () => {
      return expect(async () => new _Transaccion(1000, 123456, 123456))
        .rejects
        .toStrictEqual(new ErrorDeNegocio(`La cuenta origen y la cuenta destino no deben ser iguales`));
  });
    
    it('transacción con número de cuenta de origen y de destino con 6 dígitos debería crearla bien', () => {
        const transaccion = new _Transaccion(1000, 123456, 678900);
  
        expect(transaccion.valor).toEqual(1000);
        expect(transaccion.cuentaOrigen).toEqual(123456);
        expect(transaccion.cuentaDestino).toEqual(678900);
    });
  });