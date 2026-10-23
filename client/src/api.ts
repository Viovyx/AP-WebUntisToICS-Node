import { EventSourceInput } from 'fullcalendar';
import { apiHost } from './config';
import { CalendarEventResource, Class, CourseData, DateRange, SchoolYear } from './types';

export async function getSchoolyears(): Promise<SchoolYear[]> {
  const response = await fetch(apiHost + '/schoolyears');
  return await response.json();
}

export async function getClasses(dateRange: DateRange): Promise<Class[]> {
  const response = await fetch(apiHost + `/classes?start=${dateRange.start}&end=${dateRange.end}`);
  return await response.json();
}

export function createEventSource(
  classEl: Class,
  dateRange: DateRange,
  hiddenCourses?: CourseData[],
): CalendarEventResource {
  return {
    id: `${classEl.name} (${classEl.id})`,
    url: `${apiHost}/calendar?class=${classEl.id}&start=${dateRange.start}&end=${dateRange.end}&name=${classEl.name}&filter=${hiddenCourses
      ?.filter((h) => h.classId === classEl.id)
      .map((h) => h.courseName)
      .join()}`,
    format: 'ics',
    color: stringToColour(classEl.name),
  };
}

function stringToColour(str: string) {
  let hash = 0;
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
}
