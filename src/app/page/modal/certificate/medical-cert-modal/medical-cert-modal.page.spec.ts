import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCertModalPage } from './medical-cert-modal.page';

describe('MedicalCertModalPage', () => {
  let component: MedicalCertModalPage;
  let fixture: ComponentFixture<MedicalCertModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCertModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCertModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
