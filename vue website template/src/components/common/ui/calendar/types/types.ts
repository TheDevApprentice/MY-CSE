// Types génériques
export interface CalendarItem {
  id: string | number;
  title?: string;
  name?: string;
  [key: string]: any;
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  items?: CalendarItem[];
  [key: string]: any;
}
