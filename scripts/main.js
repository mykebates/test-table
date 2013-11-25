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
        loadPusherMessaging(user);
        //ajaxCall('http://testtable.dev/user/join', data);
    });




    // Playlist dragged onto app icon
    models.application.addEventListener('dropped', function() {
        var dropped = models.application.dropped;
        console.table(dropped);

        models.Playlist.fromURI(dropped[0].uri).load('name', 'tracks').done(function(playlist) {
            $('#own_queue ul, #own_queue h3').empty();
            $('#own_queue').prepend('<h3>'+playlist.name.decodeForHtml()+'</h3>');
            playlist.tracks.snapshot().done(function(trackSnapshot){
                var tracks = trackSnapshot.toArray();
                _.each(tracks, function(track){
                    var artist = track.artists[0];
                    var trackHTML = '<li data-id="'+track.uri+'" class="ui-state-default"><img src="'+track.image+'" />'+track.name+' - '+artist.name+'</li>';
                    $('#own_queue ul').append(trackHTML);
                });
                $( ".sortable" ).sortable();
                $( ".sortable" ).disableSelection();
                $('#own_queue ul li:first').addClass('is_current_track');
                var trackID = $('#own_queue ul li:first').data('id');
                models.player.playTrack(models.Track.fromURI(trackID));
            });
        });
    });

    // Update listener
    $( ".sortable" ).on( "sortupdate", function( event, ui ) {
        if(ui.item.index() == 0){
            var trackURI = ui.item.data('id');
            playTrack(trackURI);
        }
    });

    function playTrack(trackURI)
    {
        models.player.playTrack(models.Track.fromURI(trackURI));
    }

});
