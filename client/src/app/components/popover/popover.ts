import { Component, model, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-popover',
  imports: [],
  templateUrl: './popover.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './popover.css',
})
export class Popover {
  shown = model<boolean>(false);
  closed = output();
}
