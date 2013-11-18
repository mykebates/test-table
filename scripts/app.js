var pusher;
var channel;
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
    Pusher.log = function(message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };

    channel.bind('pusher:subscription_succeeded', function(members) {
        addUserImage(members.me.info);
    });

    pusher.connection.bind('connected', function() { //bind a function after we've connected to Pusher
        //console.log('connected');
    });

    channel.bind('debug_event', function(data) {
        alert(data.message);
    });

    channel.bind('userJoined', function(data) {
        addUserImage(data);
    });

    channel.bind('pusher:member_added', function(member) {
        console.log(member.info.username);
        addUserImage(member.info);
    });

   channel.bind('pusher:member_removed', function(member) {
        console.log('removing member');
        console.log(member);
        removeUserImage(member.info);
    });


}

function addUserImage(data){
	var userImage = '<li data-username="user_'+data.username+'" class="animated fadeIn"><img src="'+data.image+'" /></li>';
	$('#user_list').append(userImage);
}

function removeUserImage(data){
	$('#user_list li[data-username="user_'+data.username+'"]').fadeOut();
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
            if( msg.success ) {
                console.log('sdfsd');
            }else{
                alert(msg.errormsg);
            }
        },
        error: function(msg) {
            // log something
        }
    });
}