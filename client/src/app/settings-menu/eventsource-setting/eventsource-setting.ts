import {
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  output,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventSourceApi, EventSourceInput } from 'fullcalendar';
import { getClasses, getSchoolyears } from '../../../api';
import { Class, SchoolYear } from '../../../types';
import { apiHost } from '../../../config';

@Component({
  selector: 'app-eventsource-setting',
  imports: [FormsModule],
  templateUrl: './eventsource-setting.html',
  styleUrl: './eventsource-setting.css',
})
export class EventSourceSetting {
  eventSource = output<EventSourceInput>();

  constructor() {
    effect(() => {
      this.eventSource.emit({
        id: this.activeClass().name,
        url: `${apiHost}/calendar?class=${this.activeClass().id}&start=${this.activeSchoolyear().dateRange.start}&end=${this.activeSchoolyear().dateRange.end}`,
        format: 'ics',
      });
    });
  }

  schoolyears = resource({
    loader: () => getSchoolyears(),
  });
  inputSchoolyearId = input<number>();
  activeSchoolyear = linkedSignal<SchoolYear | null>(
    () =>
      this.schoolyears.value()?.find((year) => year.id == this.inputSchoolyearId()) ??
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
  inputClassId = input<number>();
  activeClass = linkedSignal<Class | null>(
    () =>
      this.classes.value()?.find((classEl) => classEl.id == this.inputClassId()) ??
      this.classes.value()?.[0] ??
      null,
  );
}
