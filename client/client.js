"use strict";

Meteor.subscribe("userData");
DNC.r_handle = Meteor.subscribe("rooms");

function loginCb(){
    Meteor.call("heartbeat");
}

DNC.login = function(service){
    switch(service){
        case "soundcloud":
            Meteor.loginWithSoundcloud({}, loginCb);
            break;
        case "facebook":
            Meteor.loginWithFacebook({}, loginCb);
            break;
        case "google":
            Meteor.loginWithGoogle({}, loginCb);
            break;
        default:
            alert("C'mon dude....");
            return;
    }

    DNC.connectService = service;
};

DNC.logout = function(){
    Meteor.call("heartbeat", true);
    Meteor.logout();
};

Meteor.Router.add({
    "/": function(){
        if(!DNC.r_handle.ready()){
            return "loader";
        }

        Session.set("roomId", null);
        return "roompicker";
    },


    "/room/:id": function(roomId){
        if(!DNC.r_handle.ready()){
            return "loader";
        }

        Session.set("roomId", roomId);

        return "room";
    }
});

Session.set("now", moment().valueOf());
Meteor.setInterval(function(){
    Session.set("now", moment().valueOf());
    Meteor.call("heartbeat");
}, 30000);

window.onunload = function() {
    DNC.Notifications.close();
};