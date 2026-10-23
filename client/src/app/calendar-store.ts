import { computed, linkedSignal, resource, Service, signal } from '@angular/core';
import {
  CalendarEventResource,
  Class,
  CourseData,
  DateRange,
  ResourceData,
  SchoolYear,
} from '../types';
import { createEventSource, getClasses, getSchoolyears } from '../api';
import { apiHost } from '../config';

@Service()
export class CalendarStore {
  readonly schoolyears = resource({
    loader: () => getSchoolyears(),
  });

  readonly classes = resource({
    params: () => {
      const schoolyear = this.schoolyears.value().find((y) => y.active);
      return schoolyear ? { schoolyear } : undefined;
    },
    loader: ({ params }) => getClasses(params.schoolyear.dateRange),
  });

  private resources = signal<ResourceData[]>([]);
  private hidden = signal<CourseData[]>([]);

  readonly classResources = this.resources.asReadonly();
  readonly hiddenCourses = this.hidden.asReadonly();
  readonly eventResources = computed<CalendarEventResource[]>(() =>
    this.classResources().map((c) =>
      createEventSource(c.classData, c.schoolYear.dateRange, this.hiddenCourses()),
    ),
  );

  constructor() {
    this.seedCalendar();
  }

  addClassResource(classResource: ResourceData) {
    this.resources.update((list) =>
      list.some((resource) => resource.classData.id === classResource.classData.id)
        ? list
        : [...list, classResource],
    );
  }

  removeClassResource(classId: number) {
    this.resources.update((list) => list.filter((resource) => resource.classData.id !== classId));
  }

  addHiddenCourse(course: CourseData) {
    this.hidden.update((list) =>
      list.some(
        (hidden) => hidden.courseName === course.courseName && hidden.classId === course.classId,
      )
        ? list
        : [...list, course],
    );
  }

  removeHiddenCourse(courseName: string, classId: number) {
    this.hidden.update((list) =>
      list.filter((hidden) => hidden.courseName !== courseName && hidden.classId !== classId),
    );
  }

  seedCalendar() {
    const urlList = new URL(window.location.href).searchParams
      .getAll('url')
      .map((url) => decodeURI(url));

    urlList.forEach(async (urlStr) => {
      const url = new URL(apiHost + urlStr);
      const classId: number = +url.searchParams.get('class');
      const dateRange: DateRange = {
        start: new Date(url.searchParams.get('start')),
        end: new Date(url.searchParams.get('end')),
      };

      const classEl: Class = this.classes.value().find((c) => c.id === classId);
      const schoolYear: SchoolYear = this.schoolyears
        .value()
        .find((y) => y.dateRange.start === dateRange.start && y.dateRange.end === dateRange.end);

      url.searchParams
        .get('filter')
        .split(',')
        .forEach((filter) =>
          filter !== ''
            ? this.addHiddenCourse({
                courseName: filter,
                classId: classEl.id,
              })
            : null,
        );

      this.addClassResource({ classData: classEl, schoolYear: schoolYear });
    });
  }
}
