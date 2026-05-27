'use strict';

const { getHolidays } = require('./holidays');

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getWeekdayOccurrences(year, month, weekday) {
  // weekday: 0=Sun … 6=Sat (JS Date convention)
  const days = [];
  const total = daysInMonth(year, month);
  for (let d = 1; d <= total; d++) {
    if (new Date(year, month - 1, d).getDay() === weekday) days.push(d);
  }
  return days;
}

async function calculateSalary({ month, year, salaryNett, nbAbsentDays, transport, icsFile }) {
  const total = daysInMonth(year, month);

  if (nbAbsentDays > total) {
    throw new Error(`Les jours d'absence (${nbAbsentDays}) dépassent le nombre de jours du mois (${total})`);
  }

  const holidays = await getHolidays(icsFile, year, month);
  const sundays = getWeekdayOccurrences(year, month, 0);   // JS 0 = Sunday
  const thursdays = getWeekdayOccurrences(year, month, 4); // JS 4 = Thursday

  const holidaysNotSunday = holidays.filter(h => !sundays.includes(h));

  const sundayBonus = sundays.length;
  const holidayBonus = holidaysNotSunday.length;
  const thursdayBonus = Math.ceil(thursdays.length * 0.25);

  const totalHours = total + sundayBonus + holidayBonus + thursdayBonus - nbAbsentDays;

  const baseSalary = totalHours * salaryNett;
  const withBonus = baseSalary * 1.10;
  const totalSalary = withBonus + transport;

  return {
    year,
    month,
    daysInMonth: total,
    totalHours,
    baseSalary: Math.round(baseSalary * 100) / 100,
    salaryWithBonus: Math.round(withBonus * 100) / 100,
    transportAllowance: Math.round(transport * 100) / 100,
    totalSalary: Math.round(totalSalary * 100) / 100,
    breakdown: {
      sundayBonusHours: sundayBonus,
      holidayBonusHours: holidayBonus,
      thursdayBonusHours: thursdayBonus,
      absentDays: nbAbsentDays,
      sundays,
      holidays,
      holidaysNotSunday,
      thursdays,
    },
  };
}

module.exports = { calculateSalary };
