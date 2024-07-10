import { fDate } from '@base/common-base';
import { getYear, isSameDay, isSameMonth } from 'date-fns';
import { DateRange } from './types';

// ----------------------------------------------------------------------

export function shortDateLabel(startDate: Date | null, endDate: Date | null) {
  const getCurrentYear = new Date().getFullYear();

  const startDateYear = startDate ? getYear(startDate) : null;

  const endDateYear = endDate ? getYear(endDate) : null;

  const currentYear =
    getCurrentYear === startDateYear && getCurrentYear === endDateYear;

  const sameDay =
    startDate && endDate
      ? isSameDay(new Date(startDate), new Date(endDate))
      : false;

  const sameMonth =
    startDate && endDate
      ? isSameMonth(new Date(startDate), new Date(endDate))
      : false;

  if (currentYear) {
    if (sameMonth) {
      if (sameDay) {
        return fDate(endDate, 'dd MMM yy');
      }
      return `${fDate(startDate, 'dd')} - ${fDate(endDate, 'dd MMM yy')}`;
    }
    return `${fDate(startDate, 'dd MMM')} - ${fDate(endDate, 'dd MMM yy')}`;
  }

  return `${fDate(startDate, 'dd MMM yy')} - ${fDate(endDate, 'dd MMM yy')}`;
}

// Shows dates corresponding to current user timezone
export const getHumanReadableRange = (range: DateRange) => {
  const format = 'MM/dd/yyyy';
  return (
    (range.start ? `from ${fDate(range.start, format)} ` : '') +
    (range.end ? `to ${fDate(range.end, format)}` : '')
  );
};
