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
  start: Date;
  end: Date;
}

export interface ResourceData {
  classData: Class;
  schoolYear: SchoolYear;
}

export interface CourseData {
  classId: number;
  courseName: string;
}

export interface CalendarEventResource extends Partial<EventImpl> {
  format?: string;
}
