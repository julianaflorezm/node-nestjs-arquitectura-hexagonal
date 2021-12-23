import { canCreateAccount, getDateFormat, isEnabledDay, isHoliday, randomFixedInteger } from "src/infraestructura/utilidades/funciones-utiles";

describe('Funciones utiles', () => {

    it('deberia generar un numero con el numero de digitos indicado', () => {
      const digitos = 6;
      
      const numero:number = randomFixedInteger(digitos);
  
      expect(numero.toString()).toHaveLength(6);
    });

    it('deberia decir que la fecha indicada es un dia festivo', () => {
        const date = new Date('2022/01/01 12:00:00');

        const response = isHoliday(date);
    
        expect(response).toBeTruthy();
      });

      it('deberia decir que la fecha indicada no es un dia festivo', () => {
        const date = new Date('2022/01/02 12:00:00');

        const response = isHoliday(date);
    
        expect(response).toBeFalsy();
      });

      it('deberia decir que la fecha indicada es un dia no habil', () => {
        const date = new Date('2021/12/26 12:00:00');
        const dateFormat = getDateFormat(date)
        const response = isEnabledDay(dateFormat);
    
        expect(response).toBeFalsy();
      });

      it('deberia decir que la fecha indicada es un dia habil', () => {
        const date = new Date('2021/12/27 12:00:00');
        const dateFormat = getDateFormat(date);
        const response = isEnabledDay(dateFormat);
    
        expect(response).toBeTruthy();
      });

      it('deberia decir que la fecha indicada esta dentro del horario para crear una cuenta', () => {
        const date = new Date('2021/12/26 12:00:00');
        const dateFormat = getDateFormat(date);
        const response = canCreateAccount(dateFormat);
    
        expect(response).toBeTruthy();
      });

      it('deberia decir que la fecha indicada no esta dentro del horario para crear una cuenta', () => {
        const date = new Date('2021/12/26 13:00:00');
        const dateFormat = getDateFormat(date);
        const response = canCreateAccount(dateFormat);
    
        expect(response).toBeFalsy();
      });
  });
  