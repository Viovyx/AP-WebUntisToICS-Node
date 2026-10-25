import {
  Component,
  computed,
  output,
  signal,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi } from 'fullcalendar';
import themePlugin from '@fullcalendar/angular/themes/forma';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import { CalendarEvent } from './calendar-event/calendar-event';
import { EventDetails } from '../event-details/event-details';
import { CalendarStore } from '../calendar-store';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CalendarEvent, EventDetails],
  templateUrl: './calendar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './calendar.css',
})
export class Calendar {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarStore = inject(CalendarStore);

  activeEvent = signal<EventApi>(null);
  settingsOpened = output();

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
      initialDate: this.isWeekend() ? this.getNextMonday() : new Date(),
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
      eventSources: this.calendarStore.eventResources(),
      eventClick: (info) => this.activeEvent.set(info.event),
    };
  });

  refetchEvents() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.refetchEvents();
  }

  isWeekend(date = new Date()) {
    return date.getDay() === 6 || date.getDay() === 0;
  }

  getNextMonday(date = new Date()) {
    const dateCopy = new Date(date.getTime());
    return new Date(dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7)));
  }

  //#region Swipte actions
  // Original source: https://onjsdev.com/article/detect-finger-swipe-gestures-in-javascript

  // Declare variables to store the timestamp and initial touch coordinates
  private touchStartTime: number;
  private touchEndTime: number;
  private clientX: number;
  private clientY: number;

  touchStart(e: TouchEvent) {
    // Record the timestamp of the touch event
    this.touchStartTime = Date.now();

    // Record the X and Y coordinates of the touch on the screen
    this.clientY = e.touches[0].clientY;
    this.clientX = e.touches[0].clientX;
  }

  touchEnd(e: TouchEvent) {
    // Record the timestamp of the touch end event
    this.touchEndTime = Date.now();

    // Call the swipe function to check if a swipe gesture occurred
    this.swipe(e, this.touchEndTime - this.touchStartTime);
  }

  private readonly DURATION_THRESHOLD = 600;
  private readonly MOVE_THRESHOLD = 50;

  swipe(e: TouchEvent, duration: number) {
    // Get the final X and Y coordinates of the touch
    const endClientX = e.changedTouches[0].clientX;
    const endClientY = e.changedTouches[0].clientY;

    // Check if the elapsed time between touchstart and touchend events is less than or equal to the duration threshold
    if (duration <= this.DURATION_THRESHOLD) {
      const calendarApi = this.calendarComponent.getApi();
      // Check if the touch moved at least MOVE_THRESHOLD pixels in the X or Y direction
      if (this.clientY - endClientY >= this.MOVE_THRESHOLD) {
        // console.log("swiped up");
      } else if (endClientY - this.clientY >= this.MOVE_THRESHOLD) {
        // console.log("swiped down");
      } else if (endClientX - this.clientX >= this.MOVE_THRESHOLD) {
        // console.log("swiped right");
        calendarApi.prev();
      } else if (this.clientX - endClientX >= this.MOVE_THRESHOLD) {
        // console.log("swiped left");
        calendarApi.next();
      }
    }
  }
}
