import {
  Component,
  computed,
  model,
  ChangeDetectionStrategy,
  output,
  input,
  inject,
} from '@angular/core';
import { Popover } from '../components/popover/popover';
import { Calendar, EventApi } from 'fullcalendar';
import { ActionButton } from '../components/action-button/action-button';
import { Class } from '../../types';
import { CalendarStore } from '../calendar-store';

@Component({
  selector: 'app-event-details',
  imports: [Popover, ActionButton],
  templateUrl: './event-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './event-details.css',
})
export class EventDetails {
  calendarStore = inject(CalendarStore);

  eventData = model<EventApi | null>(null);
  shown = computed<boolean>(() => this.eventData() !== null);

  closeEvent() {
    this.eventData.set(null);
  }

  hide() {
    const url = new URL(this.eventData().source.url);
    const classId = +url.searchParams.get('class');
    const coursName = this.eventData().title.split('(')[0];

    if (confirm(`Hide '${coursName}'?`)) {
      this.calendarStore.addHiddenCourse({ classId: classId, courseName: coursName });
      this.closeEvent();
    }
  }
}
