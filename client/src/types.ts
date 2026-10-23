import { EventImpl } from 'fullcalendar/protected-api';

export interface Class {
  id: number;
  name: string;
}

export interface SchoolYear {
  dateRange: DateRange;
  id: number;
  name: string;
  active: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ResourceData {
  classData: Class;
  schoolYear: SchoolYear;
}

export interface CourseData {
  resource: ResourceData;
  courseName: string;
}

export interface CalendarEventResource extends Partial<EventImpl> {}
