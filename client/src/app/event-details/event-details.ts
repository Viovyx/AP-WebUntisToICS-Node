import { Component, computed, model, ChangeDetectionStrategy, output, input } from '@angular/core';
import { Popover } from '../components/popover/popover';
import { EventApi } from 'fullcalendar';
import { ActionButton } from '../components/action-button/action-button';
import { Class } from '../../types';

@Component({
  selector: 'app-event-details',
  imports: [Popover, ActionButton],
  templateUrl: './event-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './event-details.css',
})
export class EventDetails {
  eventData = model<EventApi | null>(null);
  shown = computed<boolean>(() => this.eventData() !== null);
  hideEvent = output<[number, string]>();

  closeEvent() {
    this.eventData.set(null);
  }

  hide() {
    const url = new URL(this.eventData().source.url);
    const classId = +url.searchParams.get('class');
    const coursName = this.eventData().title.split('(')[0];

    if (confirm(`Hide '${coursName}'?`)) {
      this.hideEvent.emit([classId, coursName]);
      this.closeEvent();
    }
  }
}
