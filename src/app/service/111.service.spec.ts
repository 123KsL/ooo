import { TestBed } from '@angular/core/testing';

import { 111Service } from './111.service';

describe('111Service', () => {
  let service: 111Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(111Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
