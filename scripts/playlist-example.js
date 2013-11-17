require([
  '$api/models',
  '$views/list#List'
], function(models, List) {
  'use strict';

  var doPlaylistForAlbum = function() {
    var album = models.Album.fromURI('spotify:album:5nrAGwAPyL7t3HFF93mAa0');
    var list = List.forAlbum(album);
    document.getElementById('playlistContainer').appendChild(list.node);
    list.init();
  };

  exports.doPlaylistForAlbum = doPlaylistForAlbum;
});
