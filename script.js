'use strict';

function loadScript() {
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('enable-selection.js');
  s.async = true;
  // s.onload = function() {
  // this.parentNode.removeChild(this);
  // };
  (document.head || document.documentElement).appendChild(s);
}

if (document.readyState === "complete") {
  loadScript();
} else {
  window.addEventListener('load', function() {
    loadScript();
  });
}
