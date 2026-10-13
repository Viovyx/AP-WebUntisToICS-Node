import { Component, model, signal, ChangeDetectionStrategy, effect, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calendar } from './calendar/calendar';
import { SettingsMenu } from './settings-menu/settings-menu';
import { EventSourceInput } from 'fullcalendar';
import { Class, DateRange } from '../types';
import { createEventSource } from '../api';
import { apiHost } from '../config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Calendar, SettingsMenu],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('AP Webuntis To ICS');
  settingsOpen = model<boolean>(false);
  eventSources = signal<EventSourceInput[]>(this.getInitialEventSources());
  hiddenCourses = signal<Map<Class, Set<string>>>(new Map());

  addHiddenCourse(sourceDetails: [Class, string]) {
    this.hiddenCourses.update((l) => {
      const curr = l.get(sourceDetails[0]);
      return new Map(l).set(sourceDetails[0], curr.add(sourceDetails[1]));
    });
  }

  getInitialEventSources(): EventSourceInput[] {
    const urlList = new URL(window.location.href).searchParams
      .getAll('url')
      .map((url) => decodeURI(url));
    return urlList.map((urlStr) => {
      const url = new URL(apiHost + urlStr);
      const classEl: Class = {
        id: +url.searchParams.get('class'),
        name: url.searchParams.get('name'),
      };
      const dateRange: DateRange = {
        start: url.searchParams.get('start'),
        end: url.searchParams.get('end'),
      };

      return createEventSource(classEl, dateRange);
    });
  }

  constructor() {
    effect(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete('url');

      this.eventSources().forEach((s) => {
        const sourceUrl = new URL((s as any).url);
        url.searchParams.append('url', sourceUrl.pathname + sourceUrl.search);
      });

      window.history.replaceState(null, null, url); // or pushState
    });
  }
}
