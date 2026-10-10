import { Component, input, model, output, signal } from '@angular/core';

@Component({
  selector: 'app-popover',
  imports: [],
  templateUrl: './popover.html',
  styleUrl: './popover.css',
})
export class Popover {
  shown = model<boolean>(false);
  closed = output();
}
