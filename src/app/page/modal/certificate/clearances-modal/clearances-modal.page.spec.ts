import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearancesModalPage } from './clearances-modal.page';

describe('ClearancesModalPage', () => {
  let component: ClearancesModalPage;
  let fixture: ComponentFixture<ClearancesModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearancesModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearancesModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
