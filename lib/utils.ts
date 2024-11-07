import { format } from "date-fns";

export function formatDate(dateString: string) {
    return format(new Date(dateString), 'yyyy-MM-dd')
}

export function formatMonthYear(dateString: string) {
    return format(new Date(dateString), 'MMMM yyyy')
}