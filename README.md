# InstantSearch

## Consuming events as Observables

Building a simple instance search we'll face issues such as sending too many requests or getting out of order responses.

We solve these problems in a functional reactive way using Observables.

## JsonpModule from '@angular/http'

Look this up.

## URLSearchParams from '@angular/http'

Look this up.

let search = new URLSearchParams();
search.set('action', 'opensearch');
search.set('search', term);
search.set('format', 'json');

this.jsonp.get('https://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', {search})
    .map(response => response.json()[1]);


Now that we consumed the input event of our text box as an observable, we can apply a whole set of rx operators on top of it to create a more meaningful observable for our specific use case.  

When you look at the network tab in develope tool, you'll see we are currenly making a request to the wikipedia api with every single keystroke. 

What we actually want is to make requests whenever the user stopped typing for a brief moment. That means skip all the notifications up to the point where there hasn't a new notification for at least say, 400 milliseconds.

rx operator debounceTime()

If we typed Ang then deleted g and typed g again, so we end up with Ang again, we'll still make another network request to get the results for Ang. So to make it more efficient we need to filter out subsequent duplicate notifications.

rx operator distinctUntilChanged()

Observables are all about composability. We have two subscribe calls which are losely connected with a method call. 

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  items:Array<string>;
  term$ = new Subject<string>(); 
  
  constructor(private service:WikipediaSearchService) {
    this.term$
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe(term => this.search(term));
  }

  search(term: string) {
    this.service.search(term)
                .subscribe(results => this.items = results);
  }
}

// We can change the above into:
constructor(private service:WikipediaSearchService) {
this.term$
    .debounceTime(400)
    .distinctUntilChanged()
    .map(term => this.service.search(term))
    .subscribe(obsResults => {
        obsResults.subscribe(results => this.items = results);
    })
}

But we still have two subsciptions. The first subsription gives an observable which we need to subscribe to. We can do this better by using flatMap:

constructor(private service:WikipediaSearchService) {
    this.term$
        .debounceTime(400)
        .distinctUntilChanged()
        .flatMap(term => this.service.search(term))
        .subscribe(results => this.items = result);
}

flatMap is an alias for mergeMap, so we import:
import 'rxjs/add/operator/mergeMap';

flatMap flattens the observables and gives our the end result, so we don't have an observable of observable anymore. 