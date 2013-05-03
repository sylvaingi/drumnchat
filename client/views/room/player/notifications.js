var Notifications = DNC.Notifications = {};

var enabled = false;
var current = {};
var showing = false;

Notifications.show = function(track){
    if(!enabled) { return; }

    if(showing){
        Notifications.close();
    }

    current.notif = window.webkitNotifications.createNotification(
        track.serviceData.artwork_url,
        Meteor.i18n.stringFor("now-playing"),
        track.serviceData.title
    );

    current.notif.show();

    current.to = setTimeout(function(){
        Notifications.close();
    }, 10000);

    showing = true;
};

Notifications.close = function(){
    if(!enabled) { return; }

    if(showing){
        clearTimeout(current.to);
        current.notif.close();
        current.notif = null;
        showing = false;
    }
};

if(window.webkitNotifications){
    var permission = window.webkitNotifications.checkPermission();

    if (permission === 0){
        enabled = true;
    }
    else if (permission === 1){
        $(document).one("click", function(){
            window.webkitNotifications.requestPermission(function(){
                enabled = true;
            });
        });
    }
}

Deps.autorun(function(){
    var track = Session.get("player.track");

    if(track){
        Notifications.show(track);
    }
    else {
        Notifications.close();
    }
});