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
  readonly seeded = signal(false);

  readonly schoolyears = resource({
    loader: () => getSchoolyears(),
  });
  public activeSchoolyear = linkedSignal<SchoolYear | null>(() =>
    this.schoolyears.hasValue()
      ? (this.schoolyears.value().find((year) => year.active) ?? this.schoolyears.value()[0])
      : null,
  );

  readonly classes = resource({
    params: () => (this.activeSchoolyear() ? this.activeSchoolyear() : undefined),
    loader: (value) => getClasses(value.params.dateRange),
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

  setClassResources(classResources: ResourceData[]) {
    this.resources.set(classResources);
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
      list.filter((hidden) => hidden.courseName !== courseName || hidden.classId !== classId),
    );
  }

  async seedCalendar() {
    try {
      const urlList = new URL(window.location.href).searchParams
        .getAll('url')
        .map((url) => decodeURI(url));

      urlList.forEach(async (urlStr) => {
        const url = new URL(apiHost + urlStr);
        const classId: number = +url.searchParams.get('class');
        const dateRange: DateRange = {
          start: url.searchParams.get('start'),
          end: url.searchParams.get('end'),
        };

        const schoolYears = await getSchoolyears();
        const schoolYear: SchoolYear = schoolYears.find(
          (y) => y.dateRange.start === dateRange.start && y.dateRange.end === dateRange.end,
        );
        if (!schoolYear) return console.error(`Schoolyear not found for '${url}'`);

        const classes = await getClasses(schoolYear.dateRange);
        const classEl: Class = classes.find((c) => c.id === classId);
        if (!classes) return console.error(`Class not found for '${url}'`);

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
    } finally {
      this.seeded.set(true);
    }
  }
}
