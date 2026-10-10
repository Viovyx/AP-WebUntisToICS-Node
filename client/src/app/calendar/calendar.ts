import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from 'fullcalendar';
import themePlugin from '@fullcalendar/angular/themes/forma';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import { CalendarEvent } from './calendar-event/calendar-event';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CalendarEvent],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [themePlugin, iCalendarPlugin, dayGridPlugin, timeGridPlugin],
    colorScheme: 'dark',
    height: '100dvh',
    editable: false,
    expandRows: true,
    dayMaxEvents: true,
    nowIndicator: true,
    navLinks: true,
    weekNumbers: true,
    scrollTime: `08:00`,
    firstDay: 1, // Monday
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '08:00',
      endTime: '18:00',
    },
    locale: 'en-GB',
    class: 'calendar',
    headerToolbar: {
      left: 'today prev,next',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth',
    },
    footerToolbar: {
      left: 'refetchBtn',
    },
    initialView: 'timeGridWeek',
    views: {
      timeGridDay: {
        type: 'timeGrid',
        duration: { days: 1 },
      },
    },
    buttons: {
      timeGridDay: {
        text: 'Day',
      },
      refetchBtn: {
        text: 'Refetch',
        click: () => this.refetchEvents(),
      },
    },
    weekends: false,
    events: {
      url: 'http://127.0.0.1:3000/calendar?class=10235&filter=Robot%20design,Robot%20dynamics,Business%20development,Ideation,VR%20experience',
      format: 'ics',
    },
  };

  refetchEvents() {
    var calendarApi = this.calendarComponent.getApi();
    calendarApi.refetchEvents();
  }
}
