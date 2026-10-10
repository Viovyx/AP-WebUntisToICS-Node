import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-calendar-event',
  imports: [DatePipe],
  templateUrl: './calendar-event.html',
  styleUrl: './calendar-event.css',
})
export class CalendarEvent {
  eventInfo = input.required<any>();
}
