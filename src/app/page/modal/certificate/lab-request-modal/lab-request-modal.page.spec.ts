import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabRequestModalPage } from './lab-request-modal.page';

describe('LabRequestModalPage', () => {
  let component: LabRequestModalPage;
  let fixture: ComponentFixture<LabRequestModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabRequestModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabRequestModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
