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

## Rx operators for efficient and clean code

Now that we consumed the input event of our text box as an observable, we can apply a whole set of rx operators on top of it to create a more meaningful observable for our specific use case.  

When you look at the network tab in develope tool, you'll see we are currenly making a request to the wikipedia api with every single keystroke. 

What we actually want is to make requests whenever the user stopped typing for a brief moment. That means skip all the notifications up to the point where there hasn't a new notification for at least say, 400 milliseconds.

## debounceTime()

If we typed Ang then deleted g and typed g again, so we end up with Ang again, we'll still make another network request to get the results for Ang. So to make it more efficient we need to filter out subsequent duplicate notifications.

## distinctUntilChanged()

Observables are all about composability. We have two subscribe calls which are losely connected with a method call. 

<code>
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
</code>

## map

We can change the above into:
<code>
constructor(private service:WikipediaSearchService) {
    this.term$
        .debounceTime(400)
        .distinctUntilChanged()
        .map(term => this.service.search(term))
        .subscribe(obsResults => {
            obsResults.subscribe(results => this.items = results);
        })
}
</code>

But we still have two subsciptions. The first subsription gives an observable which we need to subscribe to. We can do this better by using flatMap:

<code>
constructor(private service:WikipediaSearchService) {
    this.term$
        .debounceTime(400)
        .distinctUntilChanged()
        .flatMap(term => this.service.search(term))
        .subscribe(results => this.items = result);
}
</code>

## flatMap
flatMap is an alias for mergeMap, so we import:
import 'rxjs/add/operator/mergeMap';

flatMap flattens the observables and gives our the end result, so we don't have an observable of observable anymore. 

## Out of order responses

Everytime that we rest our fingers for a brief moment, a new request goes out. It is possible that we have multiple requests witing to get back to us with a response. 

We don't have gurantee that they'll come back in order.  There may be load balances involved, that route requests to different servers and they may handle requests at different performance.

We can simulate this by adding a delay for two character searches on purpose, in our WikipediaSearchService:

<code>
search(term: string) {
    // rest of code 

    let obs = this.jsonp.get()
    .map(response => response.json()[1]);

    if (term.length === 2) {
        obs = obs.delay(1000);
    }

    return obs;
}
</code>

## switchMap

Instead of flatMap/mergeMap, we will use switchMap to overcome this problem.

Everytime we project the value into an observable, we subscribe to that observer, just as flatMap does. We also automatically unsubscribe from the previous observable that we mapped to before. 

<code>
import 'rxjs/add/operator/switchMap';

@Component({...})

    constructor(private service:WikipediaSearchService) {
        this.term$
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.service.search(term))
            .subscribe(results => this.items = results);
    }
</code> 

Now everytime a new request goes out, we unsbuscribe from the previous one. 