import { Component, computed, input, model, output, signal } from '@angular/core';
import { Popover } from '../popover/popover';
import { CloseButton } from '../components/close-button/close-button';
import { Class, SchoolYear } from '../../types';
import { getClasses, getSchoolyears } from '../../api';

@Component({
  selector: 'app-settings-menu',
  imports: [Popover, CloseButton],
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
