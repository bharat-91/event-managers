import { TestBed } from '@angular/core/testing';

import { TokenretiriverService } from './tokenretiriver.service';

describe('TokenretiriverService', () => {
  let service: TokenretiriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenretiriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
