var Notifications = DNC.Notifications = {};

var enabled = false;
var current = {};
var showing = false;

Notifications.show = function(track){
    if(!enabled) { return; }

    if(showing){
        Notifications.close();
    }

    current.notif = new window.Notification( i18n.stringFor("now-playing"), {
        icon: track.serviceData.artwork_url,
        body: track.serviceData.title
    });

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

if(window.Notification){
    $(document).one("click", function(){
        window.Notification.requestPermission(function(permission){
            if (permission === "granted")
                enabled = true;
        });
    });
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