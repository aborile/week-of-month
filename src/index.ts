import dayjs, { ConfigType } from "dayjs";

/**
 * calculates and returns the week number of the month
 *
 * @param target must be something that can be changed to date by `Dayjs`
 * @note `target` parameter **must** includes year information to calculate accurately
 * @example
 * ```typescript
 * const { month, week } = getWeekOfMonth("2024-08-01") // month: 8, week: 1
 *
 * console.log(`The '2024-08-01' is Week ${week} on Month ${month}`)
 * ```
 * @description
 * Based on [ISO 8601 definition](https://en.wikipedia.org/wiki/ISO_week_date), week 01 of the month is the week with the first Thursday of the month in it.
 *
 * Weeks start with Monday and end on Sunday.
 */
export function getWeekOfMonth(target: ConfigType) {
  const date = dayjs(target);
  let targetMonth = date.month(); // => 0-11
  const targetDate = date.date(); // => 1-31

  const startWeekDay = date.startOf("month").day(); // 0-6

  // purely calculated week number
  const originalWeek = Math.ceil((targetDate + startWeekDay - 1) / 7); // 1-5
  // correction value to get real week number by month (originalWeek + weekCorrection)
  let weekCorrection = 0;

  /**
   * If the start date of the month is Monday to Thursday, the start week is THE 1ST WEEK of that month
   * Else (the start date of the month is Friday to Sunday), the start week is THE LAST WEEK of previous month
   */

  // If the start date of the month is Monday to Thursday,
  if (startWeekDay >= 1 && startWeekDay <= 4) {
    // Monday to Thursday
    /**
     * @ExampleCase (n) = `originalWeek` value / nth = real week number
     * Mo Tu We Th Fr Sa Su       | Mo Tu We Th Fr Sa Su ~ Mo Tu We Th Fr Sa Su
     *  1  2  3  4  5  6  7 : 1st |     1  2  3  4  5  6 ~           1  2  3  4 :(1) 1st
     *  8  9 10 11 12 13 14 : 2nd |  7  8  9 10 11 12 13 ~  5  6  7  8  9 10 11 :(2) 2nd
     * 15 16 17 18 19 20 21 : 3rd | 14 15 16 17 18 19 20 ~ 12 13 14 15 16 17 18 :(3) 3rd
     * 22 23 24 25 26 27 28 : 4th | 21 22 23 24 25 26 27 ~ 19 20 21 22 23 24 25 :(4) 4th
     * 29 30 31             : 1st | 28 29 30 31          ~ 26 27 28 29 30 31    :(5) 5th/1st
     */

    /**
     * For the last week,
     * If the last date of the month is Thursday to Sunday, the last week is THE 5TH WEEK of that month
     * Else (the last date of the month is Monday to Wednesday), the last week is THE 1ST WEEK of next month
     */

    // For the last week,
    if (originalWeek === 5) {
      const endWeekDay = date.endOf("month").day(); // the last date of the month
      // the last date of the month is Monday to Wednesday
      if (endWeekDay >= 1 && endWeekDay <= 3) {
        targetMonth = date.add(1, "month").month(); // next month
        weekCorrection = -4; // 1st week (5 - 4)
      }
    }
  }

  // If the start date of the month is Sunday,
  else if (startWeekDay === 0) {
    /**
     * @ExampleCase (n) = `originalWeek` value / nth = real week number
     * Mo Tu We Th Fr Sa Su
     *                    1 :(0) 4th/5th
     *  2  3  4  5  6  7  8 :(1) 1st
     *  9 10 11 12 13 14 15 :(2) 2nd
     * 16 17 18 19 20 21 22 :(3) 3rd
     * 23 24 25 26 27 28 29 :(4) 4th
     * 30 31                :(5) 1st
     */

    // Day 1 is certainly THE LAST WEEK of previous month
    if (originalWeek === 0) {
      const lastDateOfPreviousMonth = date.subtract(1, "month").endOf("month");
      const { week } = getWeekOfMonth(lastDateOfPreviousMonth);
      targetMonth = lastDateOfPreviousMonth.month(); // previous month
      weekCorrection = week; // (0 + week)
    }
    // 5th week is certainly THE 1ST WEEK of next month
    else if (originalWeek === 5) {
      targetMonth = date.add(1, "month").month(); // next month
      weekCorrection = -4; // 1st week (5 - 4)
    }
  }

  // If the start date of the month is Friday to Saturday,
  else {
    /**
     * @ExampleCase (n) = `originalWeek` value / nth = real week number
     * Mo Tu We Th Fr Sa Su | Mo Tu We Th Fr Sa Su
     *              1  2  3 |                 1  2 :(1) 4th/5th
     *  4  5  6  7  8  9 10 |  3  4  5  6  7  8  9 :(2) 1st
     * 11 12 13 14 15 16 17 | 10 11 12 13 14 15 16 :(3) 2nd
     * 18 19 20 21 22 23 24 | 17 18 19 20 21 22 23 :(4) 3rd
     * 25 26 27 28 29 30 31 | 24 25 26 27 28 29 30 :(5) 4th
     *                      | 31                   :(6) 1st
     */

    // The start week is certainly THE LAST WEEK of previous month
    if (originalWeek === 1) {
      const lastDateOfPreviousMonth = date.subtract(1, "month").endOf("month");
      const { week } = getWeekOfMonth(lastDateOfPreviousMonth);
      targetMonth = lastDateOfPreviousMonth.month();
      weekCorrection = week - originalWeek;
    }
    // 6th week is certainly THE 1ST WEEK of next month
    else if (originalWeek === 6) {
      targetMonth = date.add(1, "month").month(); // next month
      weekCorrection = -5; // 1st week (6 - 5)
    }
    // Apply correction value ​​at once
    else {
      weekCorrection = -1;
    }
  }

  return {
    /**
     * January is month 1. => 1~12
     */
    month: targetMonth + 1,
    /**
     * The week number of month. => 1~5
     */
    week: originalWeek + weekCorrection,
  };
}
