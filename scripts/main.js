// Super super rough testing business in here

require([
    '$api/models',
    '$views/utils/dnd',
    'scripts/language-example',
    'scripts/cover-example',
    'scripts/button-example',
    'scripts/playlist-example',
], function(models, dnd, languageExample, coverExample, buttonExample, playlistExample) {
    'use strict';

    languageExample.doHelloWorld();
    // coverExample.doCoverForAlbum();
    // buttonExample.doShareButtonForArtist();
    // buttonExample.doPlayButtonForAlbum();
    // playlistExample.doPlaylistForAlbum();





    // User has entered
    var user = models.User.fromURI('spotify:user:@');
    user.load('username', 'name').done(function(user) {
        var data = {
            'image': user.image,
            'name': user.name
        }
        ajaxCall('http://testtable.mykebates.com/user/join', data);
    });

    // Playlist dragged onto app icon
    models.application.addEventListener('dropped', function() {
        var dropped = models.application.dropped; // it contains the dropped elements
        console.table(dropped);
    });

});
