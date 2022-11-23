/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ColorOneComponent } from './color-one.component';

describe('ColorOneComponent', () => {
  let component: ColorOneComponent;
  let fixture: ComponentFixture<ColorOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
