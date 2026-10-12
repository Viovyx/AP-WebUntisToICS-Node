import { Component, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calendar } from './calendar/calendar';
import { SettingsMenu } from './settings-menu/settings-menu';
import { EventSourceInput } from 'fullcalendar';

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
  eventSources = signal<EventSourceInput[]>([]);
}
