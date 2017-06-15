// Load a text resource from a file over the network:
var loadTextResource = function (url, callback){
  // Request using GET method:
  var request = new XMLHttpRequest();
  request.open('GET', url + '?hello-world' + Math.random(), true);

  // Check onload status:
  request.onload = function (){
    if (request.status < 200 || request.status > 299){
      callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
    } else{
      callback(null, request.responseText);
    }
  };

  // Return request:
  request.send();
};

// Load image:
var loadImage = function (url, callback){
  // Create new image:
  var image = new Image();

  // Check onload status:
  image.onload = function (){
    callback(null, image);
  };

  // Return image url:
  image.src = url;
};

// Load json file:
var loadJSONResource = function (url, callback){
  // Load text as a JSON file:
  loadTextResource(url, function (err, result){
    if (err){
      callback(err);
    } else{
      try {
        callback(null, JSON.parse(result));
      } catch (e){
        callback(e);
      }
    }
  });
};
