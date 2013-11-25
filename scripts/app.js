var pusher;
var channel;
var roomMembers = [];
$(function(){

	// var pusher = new Pusher('b1676ed848f98417d9d5');
 //    var channel = pusher.subscribe('testtable_channel');
 //    channel.bind('debug_event', function(data) {
 //        alert(data.message);
 //    });

 //    channel.bind('userJoined', function(data) {
 //        addUserImage(data);
 //    });

    

});

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
        addUserImage(members.me);
        var userCount = 0;
        
        _.each(members, function(member){
            if(member.info){
                userCount ++;
                addToDJList(member);
            }
        });

        // This should fire for the first person in the room
        if(userCount == 1){
            var data = {
                'member': members.me.id,
                'isFirstDJ': true
            }
            ajaxCall('http://testtable.dev/room/djadd', data);
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
    });

   channel.bind('pusher:member_removed', function(member) {
        removeUserImage(member.info);
    });


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
    ajaxCall('http://testtable.dev/room/djadd', data);
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
            
        },
        error: function(msg) {
            // log something
        }
    });
}