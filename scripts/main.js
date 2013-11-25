// Super super rough testing business in here
var pusher;
var channel;
var playerStarted = false;
var roomMembers = [];


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
                //models.player.playTrack(models.Track.fromURI(trackID));
                //console.log(getMyPusherId());
                if(channel.members.count == 1)
                {
                    ajaxCall('http://testtable.dev/room/nextsong', '', function(msg){
                        console.log('should play song from user', msg);
                    });
                }
            });
        });
    });


    models.player.addEventListener('change', function(e) {
        console.log(e.data);
        if(!e.data.playing){
            //console.log('song stopped');
            ajaxCall('http://testtable.dev/room/nextsong', '', function(msg){
                console.log('should play song from user', msg);
            });
        }
    });

    // Update listener
    $( ".sortable" ).on( "sortupdate", function( event, ui ) {
        if(ui.item.index() == 0){
            //var trackURI = ui.item.data('id');
            //playTrack(trackURI);
        }
    });

    function playTrack(trackURI)
    {
        models.player.playTrack(models.Track.fromURI(trackURI));
    }

    function test()
    {
        console.log('sdfsdfsdfsdfsdfsd');
    }

    function addUserImage(data){
        var userImage = '<li data-userid="'+data.id+'" class="animated fadeIn"><img src="'+data.info.image+'" /></li>';
        $('#user_list').append(userImage);
    }

    function removeUserImage(data){
        $('#user_list li[data-userid="'+data.id+'"]').fadeOut();
    }

    function addToDJList(member){
        // have access to the member details here but just pusing the memberid for now
        roomMembers.push(member.id);
    }

    function reportAddedMember(member){
        var data = {
            'member': member.id
        }
        ajaxCall('http://testtable.dev/room/djadd', data, function(msg){
            console.log(msg);
            console.log('should have added a member', member);
        });
    }

    function reportRemovedMember(member){
        var data = {
            'member': member.id
        }
        ajaxCall('http://testtable.dev/room/djremove', data, function(msg){
            console.log(msg);
            console.log('should have removed a member', member);
        });
    }

    function getMyPusherId()
    {
        return channel.members.me.id;
    }

    function playSongByMember(member)
    {
        $( ".sortable li.played" ).appendTo('.sortable');
        $( ".selector" ).sortable( "refreshPositions" );
        
        if(channel.members.me.id == member)
        {
            var trackURI = $( ".sortable li:first" ).data('id');
            //trackToBlast = trackURI;
            $( ".sortable li:first" ).addClass('played');
            ajaxCall('http://testtable.dev/room/broadcastsong', { 'track':  trackURI }, function(msg){
                // something here
            });
        }

        // if(trackToBlast){
        //     console.log(trackURI);
        //     models.player.playTrack(models.Track.fromURI(trackURI));
        // }
    }

    function broadcastSongToEveryone(trackURI)
    {
        models.player.playTrack(models.Track.fromURI(trackURI));
    }

    function ajaxCall(ajax_url, ajax_data, successCallback)
    {
        $.ajax({
            type : "GET",
            url : ajax_url,
            dataType : "json",
            data: ajax_data,
            time : 10,
            success : function(msg) {
                if(msg){
                    if(typeof(successCallback) == "function"){
                        successCallback(msg);
                    }
                }else{
                    console.log('ajax error');
                }
            },
            error: function(msg) {
                // log something
            }
        });
    }

    function loadPusherMessaging(user)
    {
        pusher = new Pusher('b1676ed848f98417d9d5', { authEndpoint: 'http://testtable.mykebates.com/push/auth?username='+user.username+'&name='+user.name+'&image='+user.image });
        channel = pusher.subscribe('presence-testtable');

        // Enable pusher logging - don't include this in production
        // Pusher.log = function(message) {
        //   if (window.console && window.console.log) {
        //     window.console.log(message);
        //   }
        // };

        channel.bind('pusher:subscription_succeeded', function(members) {
            var userCount = 0,
                myUserID = members.me.id;
            
            _.each(_.toArray(members.members), function(member){
                userCount ++;
                addToDJList(member);
            });

            // This should fire for the first person in the room
            if(userCount == 1){
                addUserImage(members.me);
                var data = {
                    'member': members.me.id,
                    'isFirstDJ': true
                }
                ajaxCall('http://testtable.dev/room/djadd', data);
            }else{
                // Populate visual user list on page
                channel.members.each(function(member) {
                    addUserImage(member);
                });
            }
        });

        pusher.connection.bind('connected', function() { //bind a function after we've connected to Pusher
            //console.log('connected');
        });

        channel.bind('debug_event', function(data) {
            alert(data.message);
        });

        channel.bind('pusher:member_added', function(member) {
            addUserImage(member);
            reportAddedMember(member);
        });

        channel.bind('pusher:member_removed', function(member) {
            removeUserImage(member);
            reportRemovedMember(member);
        });

        channel.bind('nextSong', function(member) {
            //console.log('should play song from member', member)
            playSongByMember(member);
        });

        channel.bind('broadcastSong', function(track) {
            broadcastSongToEveryone(track);
            console.log('should broadcastSongToEveryone');
        });

    }

});
