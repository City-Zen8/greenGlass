var CACHE_NAME = 'green-glass-cache-v1';
var urlsToCache = [
  '/www/css/style.css',
  '/www/img/recup_verre.png',
  '/www/index.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
		.then(function(cache) {
			console.log('Opened cache');
			console.log(cache);
			return cache.addAll(urlsToCache);
		})
  	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
	    caches.match(event.request)
	      .then(function(response) {
	        // Cache hit - return response
	        if (response) {
	        	console.log('cache: ' + event.request.url);
	          return response;
	        }
	        return fetch(event.request);
	      }
	    )
  	);
});

self.addEventListener('push', function (event) {

});