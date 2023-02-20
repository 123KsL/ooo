import { TestBed } from '@angular/core/testing';

import { DoublecaseService } from './doublecase.service';

describe('DoublecaseService', () => {
  let service: DoublecaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoublecaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
