import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineQuickAddModalPage } from './medicine-quick-add-modal.page';

describe('MedicineQuickAddModalPage', () => {
  let component: MedicineQuickAddModalPage;
  let fixture: ComponentFixture<MedicineQuickAddModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineQuickAddModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineQuickAddModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
