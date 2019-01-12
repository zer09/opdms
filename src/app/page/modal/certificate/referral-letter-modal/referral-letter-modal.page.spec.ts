import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralLetterModalPage } from './referral-letter-modal.page';

describe('ReferralLetterModalPage', () => {
  let component: ReferralLetterModalPage;
  let fixture: ComponentFixture<ReferralLetterModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralLetterModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralLetterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
