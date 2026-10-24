import { Component, model, signal, ChangeDetectionStrategy, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calendar } from './calendar/calendar';
import { SettingsMenu } from './settings-menu/settings-menu';
import { CalendarStore } from './calendar-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Calendar, SettingsMenu],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('AP Webuntis To ICS');
  calendarStore = inject(CalendarStore);
  settingsOpen = model<boolean>(!new URLSearchParams(location.search).has('url'));

  constructor() {
    void this.calendarStore.seedCalendar();

    effect(() => {
      const url = new URL(location.href);
      url.searchParams.delete('url');

      this.calendarStore.eventResources().forEach((s) => {
        const sourceUrl = new URL(s.url);
        url.searchParams.append('url', sourceUrl.pathname + sourceUrl.search);
      });

      history.replaceState(null, null, url); // or pushState
    });
  }
}
