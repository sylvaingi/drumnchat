Template.room.helpers({
    room: function(){
        var room = DNC.Rooms.findOne(Session.get("roomId"));

        if(!room && Session.equals("rooms.loading", false)){
            console.log("Unknown room, redirecting to home");
            Meteor.Router.to("/");
        }

        return room;
    },

    userCount: function(){
        return Meteor.users.find({roomId: Session.get("roomId")}).count();
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