import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mp4Component } from './mp4.component';
import { MatMenuModule } from '@angular/material/menu';

describe('Mp4Component', () => {
  let component: Mp4Component;
  let fixture: ComponentFixture<Mp4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [ Mp4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mp4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
