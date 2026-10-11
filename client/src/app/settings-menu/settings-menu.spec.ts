import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMenu } from './settings-menu';

describe('SettingsMenu', () => {
  let component: SettingsMenu;
  let fixture: ComponentFixture<SettingsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
