import { esDiaHabil, esFestivo, generarFecha } from "src/dominio/manejo-fechas/funciones-de-fecha";

describe('Funciones utiles', () => {

    it('deberia decir que la fecha indicada es un dia festivo', () => {
        const date = new Date('2022/01/01 12:00:00');

        const response = esFestivo(date);
    
        expect(response).toBeTruthy();
      });

      it('deberia decir que la fecha indicada no es un dia festivo', () => {
        const date = new Date('2022/01/02 12:00:00');

        const response = esFestivo(date);
    
        expect(response).toBeFalsy();
      });

      it('deberia decir que la fecha indicada es un dia no habil', () => {
        const date = new Date('2021/12/26 12:00:00');
        const dateFormat = generarFecha(date)
        const response = esDiaHabil(dateFormat);
    
        expect(response).toBeFalsy();
      });

      it('deberia decir que la fecha indicada es un dia habil', () => {
        const date = new Date('2021/12/27 12:00:00');
        const dateFormat = generarFecha(date);
        const response = esDiaHabil(dateFormat);
    
        expect(response).toBeTruthy();
      });

});
  