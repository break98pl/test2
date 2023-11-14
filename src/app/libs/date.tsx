import moment from 'moment';
import 'moment-timezone';

/**
 * The trimTimeFromSelf function trims the time part from a Date object, keeping only the date part.
 * @param date - The Date object to trim the time from.
 * @return A new Date object containing only the date information, without time.
 */
export const trimTimeFromSelf = (date: Date): Date => {
  // Create a date formatter object for the Japanese locale,
  // specifying the format for the year, month, and day, without including time.
  const fmt = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the given Date object into a string, omitting the time part.
  const strWithoutTime = fmt.format(date);

  // Create a new Date object from the formatted string, without time information.
  const withoutTime = new Date(strWithoutTime);

  // Return the new Date object containing only the date.
  return withoutTime;
};

/**
 * returns the localized short name of the weekday for the date represented by the object, with the Japanese word for "day of the week" appended to it.
 * @param date - The Date object to trim the time from.
 */

export const weekDayString = (date: Date): string => {
  // Trimming the time from the date, assuming date is a string in a recognizable date format
  const startDate = moment(date).startOf('day');

  // Getting the weekday as a number (0 for Sunday, 1 for Monday, etc.)
  const weekday = startDate.weekday();

  // Getting the short name of the weekday in Japanese locale
  const strRet = moment.weekdaysShort(true, weekday);

  // Appending the Japanese suffix for "day of the week" and returning the result
  return `${strRet}曜日`;
};

/**
 * Replaces the time of the given date to the end of that date (23:59:59).
 *
 * @param date - The moment date object to be modified.
 * @returns A new moment date object representing the end of the given date.
 */
export const replaceTimeToEndOfDate = (date: Date): Date => {
  // Clone the given date to avoid modifying the original object
  let startOfDay = moment(date).startOf('day');

  // Add 86399 seconds (23 hours, 59 minutes, 59 seconds) to set time to the end of the day
  return startOfDay.add(86399, 'seconds').toDate();
};
