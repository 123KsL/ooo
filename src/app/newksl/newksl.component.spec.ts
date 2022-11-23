import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewkslComponent } from './newksl.component';

describe('NewkslComponent', () => {
  let component: NewkslComponent;
  let fixture: ComponentFixture<NewkslComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NewkslComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewkslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
