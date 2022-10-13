import * as Holidays from 'date-holidays';
import moment = require('moment-timezone');

export function esFestivo(date: Date) {
    const hd = new Holidays();
    hd.init('CO');
    return hd.isHoliday(date);
}

export function generarFecha(date: Date) {
    return moment.tz(date, 'America/Bogota');
}

export function esDiaHabil(date) {
    if(esFestivo(date.toDate()) || date.day() === 0) {
      return false;
    }
    return true;
}
