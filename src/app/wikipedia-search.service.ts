import { Injectable } from '@angular/core';
import { URLSearchParams, Jsonp } from '@angular/http';
import 'rxjs/add/operator/delay';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WikipediaSearchService {

  constructor(private jsonp: Jsonp) { }

  search(terms: Observable<string>, debounceMs = 400 ) {
    return terms
        .debounceTime(debounceMs)
        .distinctUntilChanged()
        .switchMap(term => this.rawsearch(term));
  }


  rawsearch (term: string) {
    let search = new URLSearchParams();
    search.set('action', 'opensearch');
    search.set('search', term);
    search.set('format', 'json');

    return this.jsonp.get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', {search})
      .map(response => response.json()[1]);
      
    /*let obs = this.jsonp.get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', {search})
      .map(response => response.json()[1]);
    
    // This was just to show a delay in order of repsonses
 
    if (term.length === 2) {
      obs = obs.delay(1000);
    } 

    return obs;*/
  }
}