import { apiHost } from './config';
import { Class, DateRange, SchoolYear } from './types';

export async function getSchoolyears(): Promise<SchoolYear[]> {
  const response = await fetch(apiHost + '/schoolyears');
  return await response.json();
}

export async function getClasses(dateRange: DateRange): Promise<Class[]> {
  const response = await fetch(apiHost + `/classes?start=${dateRange.start}&end=${dateRange.end}`);
  return await response.json();
}
