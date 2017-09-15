import { TestBed, inject } from '@angular/core/testing';

import { WikipediaSearchService } from './wikipedia-search.service';

describe('WikipediaSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WikipediaSearchService]
    });
  });

  it('should be created', inject([WikipediaSearchService], (service: WikipediaSearchService) => {
    expect(service).toBeTruthy();
  }));
});
