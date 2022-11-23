/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Color-1Component } from './color-1.component';

describe('Color-1Component', () => {
  let component: Color-1Component;
  let fixture: ComponentFixture<Color-1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Color-1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Color-1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
