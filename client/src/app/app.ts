import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calendar } from './calendar/calendar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Calendar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('AP Webuntis To ICS');
}
