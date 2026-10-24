import {
  Component,
  computed,
  linkedSignal,
  model,
  resource,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { Popover } from '../components/popover/popover';
import { Class, DateRange, ResourceData, SchoolYear } from '../../types';
import { getClasses, getSchoolyears } from '../../api';
import { ActionButton } from '../components/action-button/action-button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarStore } from '../calendar-store';

@Component({
  selector: 'app-settings-menu',
  imports: [Popover, ActionButton, FormsModule, ReactiveFormsModule],
  templateUrl: './settings-menu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './settings-menu.css',
})
export class SettingsMenu {
  calendarStore = inject(CalendarStore);
  shown = model<boolean>(false);

  classesFilter = model<string>('');
  visibleClasses = computed(() => {
    if (this.calendarStore.classes.hasValue())
      return this.calendarStore.classes
        .value()
        .filter(
          (c) =>
            c.name.substring(0, this.classesFilter().length).toLowerCase() ===
            this.classesFilter().toLowerCase(),
        );
    else return [];
  });

  selectedClasses = linkedSignal({
    source: this.calendarStore.classResources,
    computation: (classResources) => classResources ?? [],
  });

  removeHiddenCourse(courseName: string, classId: number) {
    if (confirm(`Show '${courseName}' again?`))
      this.calendarStore.removeHiddenCourse(courseName, classId);
  }

  toggleClass(classResource: ResourceData) {
    this.selectedClasses.update((classes) =>
      classes.some((c) => c.classData.id === classResource.classData.id)
        ? classes.filter((c) => c.classData.id !== classResource.classData.id)
        : [...classes, classResource],
    );
  }

  toggleDetailsClass(classId: number) {
    this.detailsClassId.set(this.detailsClassId() !== classId ? classId : null);
  }

  save() {
    this.calendarStore.setClassResources(this.selectedClasses());
    this.shown.set(false);
    this.detailsClassId.set(null);
  }

  cancel() {
    this.selectedClasses.set(this.calendarStore.classResources() ?? []);
    this.shown.set(false);
    this.detailsClassId.set(null);
  }

  reset() {
    if (!confirm('Are you sure you want to reset your selection?')) return;

    this.selectedClasses.set([]);
    this.calendarStore
      .hiddenCourses()
      .forEach((hidden) =>
        this.calendarStore.removeHiddenCourse(hidden.courseName, hidden.classId),
      );
    this.save();
  }

  detailsClassId = signal<number | null>(null);
  detailsVisible = computed(
    () =>
      this.detailsClassId() !== null &&
      this.selectedClasses().some((c) => c.classData.id === this.detailsClassId()),
  );
}
