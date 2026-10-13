import {
  Component,
  computed,
  linkedSignal,
  model,
  output,
  resource,
  signal,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { Popover } from '../components/popover/popover';
import { Class, DateRange, SchoolYear } from '../../types';
import { createEventSource, getClasses, getSchoolyears } from '../../api';
import { ActionButton } from '../components/action-button/action-button';
import { EventSourceInput } from 'fullcalendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { apiHost } from '../../config';

@Component({
  selector: 'app-settings-menu',
  imports: [Popover, ActionButton, FormsModule, ReactiveFormsModule],
  templateUrl: './settings-menu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './settings-menu.css',
})
export class SettingsMenu {
  shown = model<boolean>(false);
  submitted = output<EventSourceInput[]>();

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

  selectedClasses = signal<Map<Class, DateRange>>(new Map());
  savedClasses = signal<Map<Class, DateRange>>(new Map());
  hiddenCourses = model.required<Map<Class, Set<string>>>();

  toggleClass(classEl: Class, dateRange: DateRange) {
    this.selectedClasses.update((classes) => {
      const updated = new Map(classes);
      if (!updated.delete(classEl)) updated.set(classEl, dateRange);
      return updated;
    });
  }

  save() {
    this.savedClasses.set(new Map(this.selectedClasses()));

    this.submitted.emit(
      [...this.savedClasses().entries()].map((classData) =>
        createEventSource(classData[0], classData[1]),
      ),
    );

    this.shown.set(false);
  }

  cancel() {
    this.selectedClasses.set(new Map(this.savedClasses()));
    this.shown.set(false);
  }

  reset() {
    if (!confirm('Are you sure you want to reset your selection?')) return;

    this.selectedClasses.set(new Map());
    this.save();
  }

  detailsClass = signal<Class>(undefined);
  detailsOpen = computed(() => this.detailsClass() !== undefined);
}
