"use strict";

DNC.joinRoom = function(roomId){
    console.log("Joining room "+roomId);

    if(DNC.r_handle.ready() && !DNC.Rooms.findOne({_id: roomId})){
        console.log("Unknown room, redirecting to home");
        Meteor.Router.to("/");
        return;
    }

    if(DNC.p_handle){
        DNC.p_handle.stop();
        DNC.c_handle.stop();
    }

    DNC.Player.stop();

    Session.set("playlist.loading", true);
    DNC.p_handle = Meteor.subscribe("playlist", roomId, function(){
        Session.set("playlist.loading", false);
    });

    DNC.c_handle = Meteor.subscribe("chat", roomId);
};

Template.room.helpers({
    room: function(){
        var room = DNC.Rooms.findOne(Session.get("roomId"));
        return room;
    },

    users: function(){
        return Meteor.users.find({roomId: Session.get("roomId")});
    },

    muted: function(){
        return Session.get("player.muted");
    }
});

Template.room.events({
    "click .room-mute-btn": function(event){
        event.preventDefault();
        DNC.Player.toggleMute();
    }
});

Meteor.startup(function() {
    Deps.autorun(function(){
        var roomId = Session.get("roomId");

        if(roomId){
            DNC.joinRoom(roomId);
        }
    });
});