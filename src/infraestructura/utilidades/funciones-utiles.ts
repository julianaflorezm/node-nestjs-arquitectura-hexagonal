import * as Holidays from 'date-holidays';
import moment = require('moment-timezone');

export function randomFixedInteger(length): number {
    const base = 10;
    return Math.floor(Math.pow(base, length-1) + Math.random() * (Math.pow(base, length) - Math.pow(base, length-1) - 1));
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
    const inicioHorario = 8;
    const finHorario = 12;
    if(!isEnabledDay(date)) {
        if(date.hour() < inicioHorario || date.hour() > finHorario  ) {
            return false;
        }
        return true;
    }
    return true;
}
