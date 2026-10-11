import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButton } from './action-button';

describe('ActionButton', () => {
  let component: ActionButton;
  let fixture: ComponentFixture<ActionButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
