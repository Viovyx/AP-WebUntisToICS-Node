import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseButton } from './close-button';

describe('CloseButton', () => {
  let component: CloseButton;
  let fixture: ComponentFixture<CloseButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
