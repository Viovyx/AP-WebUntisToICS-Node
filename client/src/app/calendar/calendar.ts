import { Component, computed, input, output, signal, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi } from 'fullcalendar';
import themePlugin from '@fullcalendar/angular/themes/forma';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import { CalendarEvent } from './calendar-event/calendar-event';
import { EventDetails } from '../event-details/event-details';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CalendarEvent, EventDetails],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  activeEvent = signal<EventApi>(null);
  settingsOpened = output();

  calendarUrl = input.required<string>();
  initialDate = signal<Date>(this.isWeekend() ? this.getNextMonday() : new Date());

  calendarOptions = computed<CalendarOptions>(() => {
    return {
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
      initialDate: this.initialDate(),
      firstDay: 1, // Monday
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '08:00',
        endTime: '18:00',
      },
      locale: 'en-GB',
      headerToolbar: {
        left: 'today',
        center: 'title',
        right: 'prev,next',
      },
      footerToolbar: {
        left: 'refetch',
        center: 'timeGridDay,timeGridWeek,dayGridMonth',
        right: 'settings',
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
        refetch: {
          text: 'Refetch',
          click: () => this.refetchEvents(),
        },
        settings: {
          text: 'Settings',
          click: () => this.settingsOpened.emit(),
        },
      },
      weekends: false,
      eventSources: [
        {
          id: 'CSC',
          url: 'http://localhost:3000/calendar?class=10220',
          format: 'ics',
          color: 'blue',
        },
        {
          id: 'SOF',
          url: 'http://localhost:3000/calendar?class=10235',
          format: 'ics',
        },
      ],
      eventClick: (info) => this.activeEvent.set(info.event),
    };
  });

  refetchEvents() {
    var calendarApi = this.calendarComponent.getApi();
    calendarApi.refetchEvents();
  }

  isWeekend(date = new Date()) {
    return date.getDay() === 6 || date.getDay() === 0;
  }

  getNextMonday(date = new Date()) {
    const dateCopy = new Date(date.getTime());
    return new Date(dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7)));
  }
}
