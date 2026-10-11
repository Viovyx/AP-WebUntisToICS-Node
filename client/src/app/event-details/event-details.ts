import { Component, computed, model } from '@angular/core';
import { Popover } from '../popover/popover';
import { EventApi } from 'fullcalendar';
import { CloseButton } from '../components/close-button/close-button';

@Component({
  selector: 'app-event-details',
  imports: [Popover, CloseButton],
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
