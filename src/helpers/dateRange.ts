import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export function getDateRange(planType: "Daily" | "Weekly" | "Monthly") {
  const now = new Date();

  switch (planType) {
    case "Weekly":
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      }; // Monday–Sunday
    case "Monthly":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "Daily":
    default:
      return { from: startOfDay(now), to: endOfDay(now) };
  }
}
