import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryPage } from './secretary.page';

describe('SecretaryPage', () => {
  let component: SecretaryPage;
  let fixture: ComponentFixture<SecretaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecretaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
