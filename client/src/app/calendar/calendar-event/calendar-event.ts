import { DatePipe } from '@angular/common';
import { Component, input, ChangeDetectionStrategy, computed, effect, output } from '@angular/core';
import { EventApi } from 'fullcalendar';
import { EventImpl } from 'fullcalendar/protected-api';
import { ActionButton } from '../../components/action-button/action-button';

@Component({
  selector: 'app-calendar-event',
  imports: [DatePipe],
  templateUrl: './calendar-event.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './calendar-event.css',
})
export class CalendarEvent {
  eventInfo = input.required<any>();
}
