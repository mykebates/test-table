$(function(){

	var pusher = new Pusher('b1676ed848f98417d9d5');
    var channel = pusher.subscribe('testtable_channel');
    channel.bind('debug_event', function(data) {
        alert(data.message);
    });

    channel.bind('userJoined', function(data) {
        addUserImage(data);
    });

});

function addUserImage(data){
	var userImage = '<li class="animated fadeIn"><img src="'+data.image+'" /></li>';
	$('#user_list').append(userImage);
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
                successCallback(msg);
            }else{
                alert(msg.errormsg);
            }
        },
        error: function(msg) {
            // log something
        }
    });
}