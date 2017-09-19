import { TestBed, inject } from '@angular/core/testing';

import { ApiTransformerService } from './api-transformer.service';

describe('ApiTransformerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiTransformerService]
    });
  });

  it('should be created', inject([ApiTransformerService], (service: ApiTransformerService) => {
    expect(service).toBeTruthy();
  }));
});
