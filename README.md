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