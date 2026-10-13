import {
  Component,
  computed,
  linkedSignal,
  model,
  resource,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Popover } from '../components/popover/popover';
import { Class, DateRange, SchoolYear } from '../../types';
import { getClasses, getSchoolyears } from '../../api';
import { ActionButton } from '../components/action-button/action-button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-menu',
  imports: [Popover, ActionButton, FormsModule, ReactiveFormsModule],
  templateUrl: './settings-menu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './settings-menu.css',
})
export class SettingsMenu {
  shown = model<boolean>(false);

  schoolyears = resource({
    loader: () => getSchoolyears(),
  });
  activeSchoolyear = linkedSignal<SchoolYear | null>(
    () =>
      this.schoolyears.value()?.find((year) => year.active) ??
      this.schoolyears.value()?.[0] ??
      null,
  );

  classes = resource({
    params: () => {
      const schoolyear = this.activeSchoolyear();
      return schoolyear ? { schoolyear } : undefined;
    },
    loader: ({ params }) => getClasses(params.schoolyear.dateRange),
  });
  classesFilter = model<string>('');
  visibleClasses = computed(() =>
    this.classes
      .value()
      .filter(
        (c) =>
          c.name.substring(0, this.classesFilter().length).toLowerCase() ===
          this.classesFilter().toLowerCase(),
      ),
  );

  savedClasses = model<Map<number, [Class, DateRange]>>();
  selectedClasses = linkedSignal({
    source: this.savedClasses,
    computation: (savedClasses) => new Map(savedClasses ?? []),
  });
  hiddenCourses = model.required<Map<number, Set<string>>>();

  removeHiddenCourse(classId: number, coursName: string) {
    this.hiddenCourses.update((m) => {
      const courses = m.get(classId);
      const updated = new Map(m);
      courses.delete(coursName);
      updated.set(classId, courses);
      return updated;
    });
  }

  toggleClass(classEl: Class, dateRange: DateRange) {
    this.selectedClasses.update((classes) => {
      const updated = new Map(classes);
      if (!updated.delete(classEl.id)) updated.set(classEl.id, [classEl, dateRange]);
      return updated;
    });
  }

  save() {
    this.savedClasses.set(new Map(this.selectedClasses()));
    this.shown.set(false);
    this.detailsClass.set(null);
  }

  cancel() {
    this.selectedClasses.set(new Map(this.savedClasses() ?? []));
    this.shown.set(false);
    this.detailsClass.set(null);
  }

  reset() {
    if (!confirm('Are you sure you want to reset your selection?')) return;

    this.selectedClasses.set(new Map());
    this.hiddenCourses.set(new Map());
    this.save();
  }

  detailsClass = signal<number | null>(null);
  detailsVisible = computed(
    () => this.detailsClass() !== null && this.selectedClasses().has(this.detailsClass()),
  );
}
