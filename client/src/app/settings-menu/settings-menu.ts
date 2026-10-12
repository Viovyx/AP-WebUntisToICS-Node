import { Component, model, signal } from '@angular/core';
import { Popover } from '../popover/popover';
import { Class, SchoolYear } from '../../types';
import { getClasses, getSchoolyears } from '../../api';
import { ActionButton } from '../components/action-button/action-button';

@Component({
  selector: 'app-settings-menu',
  imports: [Popover, ActionButton],
  templateUrl: './settings-menu.html',
  styleUrl: './settings-menu.css',
})
export class SettingsMenu {
  activeSchoolyear = signal<SchoolYear>(null);
  activeClass = signal<Class>(null);

  shown = model<boolean>(false);
  schoolyears = signal<SchoolYear[]>([]);
  classes = signal<Class[]>([]);

  async ngOnInit() {
    this.schoolyears.set(await getSchoolyears());
    this.classes.set(await getClasses());
  }
}
