import { Component, output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  imports: [],
  templateUrl: './close-button.html',
  styleUrl: './close-button.css',
})
export class CloseButton {
  closed = output();
}
