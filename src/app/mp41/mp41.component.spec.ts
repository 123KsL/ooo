import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mp41Component } from './mp41.component';

describe('Mp41Component', () => {
  let component: Mp41Component;
  let fixture: ComponentFixture<Mp41Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mp41Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mp41Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
