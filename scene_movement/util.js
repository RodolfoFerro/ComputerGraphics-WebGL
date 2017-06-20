'use strict';

// Answer provided by 'jolly.exe' in StackOverflow post
//  http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Taken from http://stackoverflow.com/questions/641857/javascript-window-resize-event
//  Post by user Alex V
function AddEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

function RemoveEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.removeEventListener) {
        object.removeEventListener(type, callback, false);
    } else if (object.detachEvent) {
        object.detachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

// Load a text resource from a file over the network:
function loadTextResource (url, callback){
  // Request using GET method:
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  // Check onload status:
  request.onload = function (e){
    if (request.status < 200 || request.status > 299){
      console.error('Error: HTTP Status ', url, request.status, request.statusText);
      callback(new Error(request.statusText));
    } else{
      callback(null, request.responseText);
    }
  };

  // Return request:
  request.onerror = callback;
  request.send();
};

// Load image:
function loadImage (url, callback){
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
function loadJSONResource (url, callback){
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
