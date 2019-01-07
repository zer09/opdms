import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationInstructionModalPage } from './medication-instruction-modal.page';

describe('MedicationInstructionModalPage', () => {
  let component: MedicationInstructionModalPage;
  let fixture: ComponentFixture<MedicationInstructionModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicationInstructionModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationInstructionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
