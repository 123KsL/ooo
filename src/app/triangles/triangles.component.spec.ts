import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrianglesComponent } from './triangles.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('TrianglesComponent', () => {
  let component: TrianglesComponent;
  let fixture: ComponentFixture<TrianglesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TrianglesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrianglesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
