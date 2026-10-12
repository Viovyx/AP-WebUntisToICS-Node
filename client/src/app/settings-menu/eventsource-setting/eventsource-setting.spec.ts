import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsourceSetting } from './eventsource-setting';

describe('EventsourceSetting', () => {
  let component: EventsourceSetting;
  let fixture: ComponentFixture<EventsourceSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsourceSetting],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsourceSetting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
