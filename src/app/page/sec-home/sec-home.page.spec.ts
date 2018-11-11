import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecHomePage } from './sec-home.page';

describe('SecHomePage', () => {
  let component: SecHomePage;
  let fixture: ComponentFixture<SecHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecHomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
