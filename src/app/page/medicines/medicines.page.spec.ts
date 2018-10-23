import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinesPage } from './medicines.page';

describe('MedicinesPage', () => {
  let component: MedicinesPage;
  let fixture: ComponentFixture<MedicinesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicinesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
