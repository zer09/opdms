import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemovePopoverPage } from './add-remove-popover.page';

describe('AddRemovePopoverPage', () => {
  let component: AddRemovePopoverPage;
  let fixture: ComponentFixture<AddRemovePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddRemovePopoverPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemovePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
