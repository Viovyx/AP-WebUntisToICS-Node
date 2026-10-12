import { DatePipe } from '@angular/common';
import { Component, input, ChangeDetectionStrategy, computed, effect } from '@angular/core';
import { EventApi } from 'fullcalendar';
import { EventImpl } from 'fullcalendar/protected-api';

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
