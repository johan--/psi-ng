import { Injectable } from '@angular/core';
import instantsearch from 'instantsearch.js/es';

@Injectable()
export class AlgoliaService {
  
  // instantsearch instance
  basevegSearch = instantsearch({
    appId: 'YOTVBFEBJC',
    apiKey: '536db11e7d4efdc32def482eb1b05e5b',
    indexName: 'Vegetations',
    urlSync: true
  });

  constructor() { }

}
