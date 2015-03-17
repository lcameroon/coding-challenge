var restify = require('restify');
var JefNode = require('json-easy-filter').JefNode;

var api = {};

api.dataFilter = function(data) {
  // fields to filter
  var fields = { image: 'showImage', slug: 'slug', title: 'title'};
  var show = [];
  data = JSON.parse(data);

  if (Array.isArray(data.payload)) {
    for (var key in data.payload) {
      if (data.payload[key].drm === true && data.payload[key].episodeCount > 0) {
        var info = {};
        for (var item in fields) {
          var res = new JefNode(data.payload[key]).filter(function(node) {
            if (node.get(fields[item]) && node.level <= 1) {
              info[item] = node.value[fields[item]];
              return false;
            }
          });
        }
        show.push(info);
      }
    }
  } else {
    show = false;
  }

  return show;
}

api.postJSON = function(req, res, next) {
  var shows = api.dataFilter(req.body)

  if (Array.isArray(shows)) {
    response = {};
    response.response = shows;
    res.send(response);
  }
  next();
}

module.exports = api;

var server = restify.createServer({
  formatters: {
    'application/json': function customizedFormatJSON( req, res, body ) {

      if ( body instanceof Error ) {
        res.statusCode = body.statusCode || 500;

        if ( body.body ) {
          body = {
            error: "Could not decode request: " + body.body.message
          };
        } else {
          body = {
            error: body.message
          };
        }
      } else if ( Buffer.isBuffer( body ) ) {
        body = body.toString( 'base64' );
      }

      var data = JSON.stringify( body );
      res.setHeader( 'Content-Length', Buffer.byteLength( data ) );

      return data;
    }
  }
});
server.use(restify.bodyParser());
server.post('/filter', api.postJSON);
server.listen(5000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
