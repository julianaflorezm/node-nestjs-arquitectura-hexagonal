import * as Holidays from 'date-holidays';
import moment = require('moment-timezone');

export function randomFixedInteger(length): number {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
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
        if(date.hour() < 8 || date.hour() > 12) {
            return false;
        }
        return true;
    }
    return true;
}