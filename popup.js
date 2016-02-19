// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(function(apiKey) {
  'use strict';

  if (!apiKey) {
    console.error('no apikey..!!');
    return;
  }

  function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
  }

  /**
   * @param {string} searchTerm - Search term
   * @param {function(string,number,number)} callback - Called when an image has
   *   been found. The callback gets the URL, width and height of the image.
   * @param {function(string)} errorCallback - Called when the image is not found.
   *   The callback gets a string that describes the failure reason.
   */
  function getImageUrl(searchTerm, callback, errorCallback) {
    var searchUrl = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(searchTerm) +
    '&cx=015734221451335448505%3Aogelzxkrimi&imgSize=medium&dateRestrict=d30&key=' + encodeURIComponent(apiKey);

    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    x.responseType = 'json';
    x.onload = function() {
      var response = x.response;
      // console.log(response);
      if (!response || !response.items || response.items.length === 0) {
        errorCallback('No response from yahoo..!!');
        return;
      }

      var images = [];
      response.items.forEach(function(value, index) {
        if(value.pagemap && value.pagemap.metatags && value.pagemap.metatags[0] &&
          value.pagemap.metatags[0]['og:image']) {
          images.push(value.pagemap.metatags[0]);
        }
      });

      if (images.length < 1) {
        errorCallback('No images from yahoo..!!');
        return;
      }

      var rstLen = images.length;
      var index = Math.floor(Math.random() * rstLen);
      var result = images[index];
      // console.log(result);
      var imageUrl = result['og:image'];
      var width = parseInt(result['og:image:width']);
      width = width > 400 ? 400 : width;
      var height = parseInt(result['og:image:height']);
      height = height > 250 ? 250 : height;
      console.assert(
        typeof imageUrl === 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected response from yahoo..!!');
      callback(imageUrl, width, height);
    };
    x.onerror = function() {
      errorCallback('Network error.');
    };
    x.send();
  }

  document.addEventListener('DOMContentLoaded', function() {
    var searchWord = 'jessica alba';
    renderStatus('Performing image search for ' + searchWord);
    getImageUrl(searchWord,
      function(imageUrl, width, height) { // success callback
        renderStatus('Search term: ' + searchWord + '\n' +
          'image search result: ' + imageUrl);
        var imageResult = document.getElementById('image-result');
        // Explicitly set the width/height to minimize the number of reflows. For
        // a single image, this does not matter, but if you're going to embed
        // multiple external images in your page, then the absence of width/height
        // attributes causes the popup to resize multiple times.
        imageResult.width = width;
        imageResult.height = height;
        imageResult.src = imageUrl;
        imageResult.style.display = 'block';
      },
      function(errorMessage) { // error callback
        renderStatus('Cannot display image. ' + errorMessage);
      });
  });
})(window.apiKey);
