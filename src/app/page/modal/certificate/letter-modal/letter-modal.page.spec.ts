import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterModalPage } from './letter-modal.page';

describe('LetterModalPage', () => {
  let component: LetterModalPage;
  let fixture: ComponentFixture<LetterModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
