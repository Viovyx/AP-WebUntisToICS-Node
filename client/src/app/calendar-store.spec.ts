import { TestBed } from '@angular/core/testing';
import { CalendarStore } from './calendar-store';

describe('CalendarStore', () => {
  let service: CalendarStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
