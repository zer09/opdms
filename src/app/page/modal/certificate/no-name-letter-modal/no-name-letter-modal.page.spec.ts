import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoNameLetterModalPage } from './no-name-letter-modal.page';

describe('NoNameLetterModalPage', () => {
  let component: NoNameLetterModalPage;
  let fixture: ComponentFixture<NoNameLetterModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoNameLetterModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoNameLetterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
