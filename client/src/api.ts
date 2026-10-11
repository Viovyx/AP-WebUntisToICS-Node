import { apiHost } from './config';
import { Class, SchoolYear } from './types';

export async function getSchoolyears(): Promise<SchoolYear[]> {
  const response = await fetch(apiHost + '/schoolyears');
  return await response.json();
}

export async function getClasses(): Promise<Class[]> {
  const response = await fetch(apiHost + '/classes');
  return await response.json();
}
