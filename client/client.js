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
    "/": {
        to: "roompicker",
        and: function(){
            Session.set("roomId", null);
        }
    },
    "/room/:_id": {
        to: "room",
        and: function(id){
            Session.set("roomId", id);
        }
    }
});

Meteor.Router.filters({
    "loader": function(page){
        if(!DNC.r_handle.ready()){
            return "loader";
        }
        else {
            return page;
        }
    }
});
Meteor.Router.filter("loader");

Session.set("now", moment().valueOf());
Meteor.setInterval(function(){
    Session.set("now", moment().valueOf());
    Meteor.call("heartbeat");
}, 30000);

window.onunload = function() {
    DNC.Notifications.close();
};