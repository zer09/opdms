import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedInstructionQuickAddPage } from './med-instruction-quick-add.page';

describe('MedInstructionQuickAddPage', () => {
  let component: MedInstructionQuickAddPage;
  let fixture: ComponentFixture<MedInstructionQuickAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedInstructionQuickAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedInstructionQuickAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
