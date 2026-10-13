import { Component, model, signal, ChangeDetectionStrategy, effect, computed } from '@angular/core';
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
  hiddenCourses = signal<Map<number, Set<string>>>(new Map());
  savedClassSources = model<Map<number, [Class, DateRange]>>(this.getInitialClassSources());
  eventSources = computed<EventSourceInput[]>(() =>
    [...this.savedClassSources()].map((data) =>
      createEventSource(data[1][0], data[1][1], [
        ...(this.hiddenCourses().get(data[1][0].id) ?? []),
      ]),
    ),
  );

  addHiddenCourse(classId: number, coursName: string) {
    this.hiddenCourses.update((l) => {
      const curr = l.get(classId);

      return new Map(l).set(classId, curr ? curr.add(coursName) : new Set([coursName]));
    });
  }

  getInitialClassSources(): Map<number, [Class, DateRange]> {
    const urlList = new URL(window.location.href).searchParams
      .getAll('url')
      .map((url) => decodeURI(url));

    const sources: Map<number, [Class, DateRange]> = new Map();

    urlList.forEach((urlStr) => {
      const url = new URL(apiHost + urlStr);
      const classEl: Class = {
        id: +url.searchParams.get('class'),
        name: url.searchParams.get('name'),
      };
      const dateRange: DateRange = {
        start: url.searchParams.get('start'),
        end: url.searchParams.get('end'),
      };
      url.searchParams
        .get('filter')
        .split(',')
        .forEach((filter) => this.addHiddenCourse(classEl.id, filter));

      sources.set(classEl.id, [classEl, dateRange]);
    });

    return sources;
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
