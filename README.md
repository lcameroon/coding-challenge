Simple JSON API
===========

## Installation

To get this server up and running, do the following:

* Install [Node](http://nodejs.org)
* Type `npm install` the first time to get the server's dependencies
* Type `node app.js` to start the server
* Go to `http://localhost:5000` in your browser

## Testing the API using cURL

If you want to test your API before using it in a client application, you can use the demo page:

    http://localhost:5000

Post some JSON data to filter:

    curl -i -X POST -H 'Content-Type: application/json' -d '{ "payload": [ { "drm": true, "episodeCount": 3, "image": { "showImage": "http://catchup.ninemsn.com.au/img/jump-in/shows/16KidsandCounting1280.jpg" }, "slug": "show/16kidsandcounting", "title": "16 Kids and Counting" } ] }' http://0.0.0.0:5000/
