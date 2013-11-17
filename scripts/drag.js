require(['$views/utils/dnd'], function(dnd) {

  function test(element) {
    return element.tagName.toLowerCase() === 'img';
  }

  function getData() {
    return {
      'text/plain': 'http://www.spotify.com/',
      'text/html': '&lt;a href="http://www.spotify.com/"&gt;Spotify.com&lt;/a&gt;'
    };
  }

  function getText() {
    return 'Spotify.com';
  }

  dnd.drag.addHandler(test, getData, getText);

});