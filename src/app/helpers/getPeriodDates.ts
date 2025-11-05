// import { subDays, subMonths, subYears, startOfDay } from "date-fns";

// export const getPeriodDates = (period: string): { startDate: string; endDate: string } => {
//     const today = startOfDay(new Date());
//     let start: Date;

//     switch (period) {
//         case "Last week":
//             start = subDays(today, 7);
//             break;
//         case "Last month":
//             start = subMonths(today, 1);
//             break;
//         case "Last quarter":
//             start = subMonths(today, 3);
//             break;
//         case "Last year":
//             start = subYears(today, 1);
//             break;
//         default:
//             start = subDays(today, 7); // default fallback
//     }

//     const formatDate = (d: Date) =>
//         `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
//             .getDate()
//             .toString()
//             .padStart(2, "0")}`;

//     return {
//         startDate: formatDate(start),
//         endDate: formatDate(today),
//     };
// }
