import { Component, input, output } from '@angular/core';
import type * as CSS from 'csstype';

@Component({
  selector: 'app-action-button',
  imports: [],
  templateUrl: './action-button.html',
  styleUrl: './action-button.css',
})
export class ActionButton {
  clicked = output();
  color = input.required<CSS.Properties['color']>();
  text = input.required<string>();
}
