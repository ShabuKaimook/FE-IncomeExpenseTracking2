export const PERIOD_MODE = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
} as const;
export type PeriodMode = (typeof PERIOD_MODE)[keyof typeof PERIOD_MODE];