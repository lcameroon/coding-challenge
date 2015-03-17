var restify = require('restify');
var assert = require("assert");
var api = require("../app.js");

// init the test client
var client = restify.createJsonClient({
  url: 'http://0.0.0.0:5000',
  version: '*'
});

// mockRequest
var mockRequest = { "payload": [ { "drm": true, "episodeCount": 3, "image": { "showImage": "http://ninemsn.com.au/image.jpg" }, "slug": "show/slug-of-the-show", "title": "Title of the show" } ] }

describe('Filter API test', function(){

  describe('Module api', function(){
    it('should have a dataFilter Method', function(){
      assert.equal(typeof api, 'object');
      assert.equal(typeof api.dataFilter, 'function');
    });
    it('should have a postJSON Method', function(){
      assert.equal(typeof api, 'object');
      assert.equal(typeof api.postJSON, 'function');
    });
  })

  describe('#dataFilter()', function(){
    it('Should Filter data by showImage, slug and title', function(){
      var data = api.dataFilter(mockRequest);
      assert.equal(true, Array.isArray(data));
      assert.equal("http://ninemsn.com.au/image.jpg", data[0].image);
      assert.equal("show/slug-of-the-show", data[0].slug);
      assert.equal("Title of the show", data[0].title);
    });
    it('Should return false when payload is not Array', function(){
      var mockRequest = '{ "payload": "..." }'
      var data = api.dataFilter(mockRequest);
      assert.equal(false, data);
    });
  });

  describe('#postJSON()', function(done){
    it('Should accept application/json', function(){
      client.post('/filter', mockRequest, function(err, req, res, data) {
        assert.equal("application/json", req.headers.accept);
        assert.equal(mockRequest, req.body);
      });
    });

    it('Should return error if Invalid JSON', function(){
      var mockResponse = {"error":"Could not decode request: Invalid JSON: Unexpected token a"}
      assert.equal(typeof mockResponse, 'object');
      assert.equal("Could not decode request: Invalid JSON: Unexpected token a", mockResponse.error);
    });
  });
});
