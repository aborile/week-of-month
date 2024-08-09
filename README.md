# @aborile/week-of-month

## Installation

```bash
yarn add @aborile/week-of-month
```

or

```bash
npm install @aborile/week-of-month
```

## Definition

> The [ISO 8601 definition](https://en.wikipedia.org/wiki/ISO_week_date) for week 01 is the week with the first Thursday of the Gregorian year (i.e. of January) in it.
>
> Weeks start with Monday and end on Sunday.

Based on this definition, week 01 of the month is the week with the first Thursday of the month in it. This library will calculate the week number of month by checking when the start date of the month is (and checking the week number of the last week of previous month, if necessary).

Please note that this library follows ISO 8601 definition, so **weeks start with Monday**.

For example, the week numbers of August, 2024 and September, 2024 are as follows:

```
[ August, 2024 ]
Mo Tu We Th Fr Sa Su
          1  2  3  4 : Aug / Week 01
 5  6  7  8  9 10 11 : Aug / Week 02
12 13 14 15 16 17 18 : Aug / Week 03
19 20 21 22 23 24 25 : Aug / Week 04
26 27 28 29 30 31    : Aug / Week 05
```

```
[ September, 2024 ]
Mo Tu We Th Fr Sa Su
                   1 : Aug / Week 05
 2  3  4  5  6  7  8 : Sep / Week 01
 9 10 11 12 13 14 15 : Sep / Week 02
16 17 18 19 20 21 22 : Sep / Week 03
23 24 25 26 27 28 29 : Sep / Week 04
30 31                : Oct / Week 01
```

## Usage

```typescript
import { getWeekOfMonth } from "@aborile/week-of-month";

const { month, week } = getWeekOfMonth("2024-08-01"); // month: 8, week: 1

console.log(`The '2024-08-01' is Week ${week} on Month ${month}`);
```
