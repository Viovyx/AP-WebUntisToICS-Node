import {
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  output,
  resource,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Popover } from '../components/popover/popover';
import { Class, DateRange, SchoolYear } from '../../types';
import { getClasses, getSchoolyears } from '../../api';
import { ActionButton } from '../components/action-button/action-button';
import { EventInput, EventSourceFuncInfo, EventSourceInput } from 'fullcalendar';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { apiHost } from '../../config';

@Component({
  selector: 'app-settings-menu',
  imports: [
    Popover,
    ActionButton,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings-menu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './settings-menu.css',
})
export class SettingsMenu {
  shown = model<boolean>(false);
  submitted = output<EventSourceInput[]>();

  schoolyears = resource({
    loader: () => getSchoolyears(),
  });
  activeSchoolyear = linkedSignal<SchoolYear | null>(
    () =>
      this.schoolyears.value()?.find((year) => year.active) ??
      this.schoolyears.value()?.[0] ??
      null,
  );

  classes = resource({
    params: () => {
      const schoolyear = this.activeSchoolyear();
      return schoolyear ? { schoolyear } : undefined;
    },
    loader: ({ params }) => getClasses(params.schoolyear.dateRange),
  });

  selectedClasses = signal<Map<Class, DateRange>>(new Map());
  savedClasses = signal<Map<Class, DateRange>>(new Map());

  toggleClass(classEl: Class, dateRange: DateRange) {
    this.selectedClasses.update((classes) => {
      const updated = new Map(classes);
      if (!updated.delete(classEl)) updated.set(classEl, dateRange);
      return updated;
    });
  }

  save() {
    this.savedClasses.set(new Map(this.selectedClasses()));

    this.submitted.emit(
      [...this.savedClasses().entries()].map((classData) => ({
        id: `${classData[0].name} (${classData[0].id})`,
        url: `${apiHost}/calendar?class=${classData[0].id}&start=${classData[1].start}&end=${classData[1].end}`,
        format: 'ics',
        color: this.stringToColour(classData[0].name),
      })),
    );

    this.shown.set(false);
  }

  cancel() {
    this.selectedClasses.set(new Map(this.savedClasses()));
    this.shown.set(false);
  }

  // Source - https://stackoverflow.com/a/16348977
  // Posted by Joe Freeman, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-10-13, License - CC BY-SA 4.0
  stringToColour = (str: string) => {
    let hash = 0;
    str.split('').forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, '0');
    }
    return colour;
  };
}
