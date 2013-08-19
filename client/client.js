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

Router.configure({
    layout: 'layout',
    loadingTemplate: 'loader'
});

Router.map(function() {
    this.route('roompicker', {
        path: "/",
        waitOn: DNC.r_handle,
        onAfterRun: function (){
            Session.set("roomId", null);
        }
    });

    this.route('room', {
        path: "/:_id",
        data: function() { return DNC.Rooms.findOne(this.params._id); },
        notFoundTemplate: "roomNotFound",
        onAfterRun: function (){
            Session.set("roomId", this.params._id);
        }
    });
});

Session.set("now", moment().valueOf());
Meteor.setInterval(function(){
    Session.set("now", moment().valueOf());
    Meteor.call("heartbeat");
}, 30000);

window.onunload = function() {
    DNC.Notifications.close();
};