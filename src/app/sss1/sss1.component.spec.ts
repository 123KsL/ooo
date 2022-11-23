import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sss1Component } from './sss1.component';

describe('Sss1Component', () => {
  let component: Sss1Component;
  let fixture: ComponentFixture<Sss1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sss1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sss1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
