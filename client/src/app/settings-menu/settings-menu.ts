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
import { Class, SchoolYear } from '../../types';
import { getClasses, getSchoolyears } from '../../api';
import { ActionButton } from '../components/action-button/action-button';
import { EventInput, EventSourceFuncInfo, EventSourceInput } from 'fullcalendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-menu',
  imports: [Popover, ActionButton, FormsModule],
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
  inputSchoolyearId = input<number>();
  activeSchoolyear = linkedSignal<SchoolYear | null>(
    () =>
      this.schoolyears.value()?.find((year) => year.id == this.inputSchoolyearId()) ??
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
  inputClassId = input<number>();
  activeClass = linkedSignal<Class | null>(
    () =>
      this.classes.value()?.find((classEl) => classEl.id == this.inputClassId()) ??
      this.classes.value()?.[0] ??
      null,
  );
}
