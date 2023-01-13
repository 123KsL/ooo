import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DddComponent } from './ddd.component';

describe('DddComponent', () => {
  let component: DddComponent;
  let fixture: ComponentFixture<DddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
