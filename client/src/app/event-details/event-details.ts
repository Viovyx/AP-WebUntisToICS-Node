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

  hideCourse = output<[Class, string]>();

  closeEvent() {
    this.eventData.set(null);
  }
}
