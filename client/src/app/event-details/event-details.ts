import { Component, computed, model } from '@angular/core';
import { Popover } from '../components/popover/popover';
import { EventApi } from 'fullcalendar';
import { ActionButton } from '../components/action-button/action-button';

@Component({
  selector: 'app-event-details',
  imports: [Popover, ActionButton],
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
