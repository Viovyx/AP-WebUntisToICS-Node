import { Component, computed, input, model, signal } from '@angular/core';
import { Popover } from '../popover/popover';
import { EventApi } from 'fullcalendar';

@Component({
  selector: 'app-event-details',
  imports: [Popover],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails {
  eventData = model<EventApi | null>(null);
  shown = computed<boolean>(() => this.eventData() !== null);

  closeEvent() {
    this.eventData.set(null);
  }
}
