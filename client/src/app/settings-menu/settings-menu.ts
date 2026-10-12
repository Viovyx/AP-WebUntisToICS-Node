import { Component, effect, model, output, signal } from '@angular/core';
import { Popover } from '../components/popover/popover';
import { Class, SchoolYear } from '../../types';
import { getClasses, getSchoolyears } from '../../api';
import { ActionButton } from '../components/action-button/action-button';
import { EventSourceSetting } from './eventsource-setting/eventsource-setting';
import { EventInput, EventSourceFuncInfo, EventSourceInput } from 'fullcalendar';

@Component({
  selector: 'app-settings-menu',
  imports: [Popover, ActionButton, EventSourceSetting],
  templateUrl: './settings-menu.html',
  styleUrl: './settings-menu.css',
})
export class SettingsMenu {
  shown = model<boolean>(false);
  submitted = output<EventSourceInput[]>();
}
