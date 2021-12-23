import * as Holidays from 'date-holidays';
import moment = require('moment-timezone');
import { BASE, FIN_HORARIO, INICIO_HORARIO } from './constantes-comunes';

export function randomFixedInteger(length): number {
    return Math.floor(Math.pow(BASE, length-1) + Math.random() * (Math.pow(BASE, length) - Math.pow(BASE, length-1) - 1));
}

export function isHoliday(date: Date) {
    const hd = new Holidays();
    hd.init('CO');
    return hd.isHoliday(date);
}

export function getDateFormat(date: Date) {
    return moment.tz(date, 'America/Bogota');
}

export function isEnabledDay(date) {
    if(isHoliday(date.toDate()) || date.day() === 0) {
      return false;
    }
    return true;
}

export function canCreateAccount(date) {
    if(!isEnabledDay(date)) {
        if(date.hour() < INICIO_HORARIO || date.hour() > FIN_HORARIO  ) {
            return false;
        }
        return true;
    }
    return true;
}
