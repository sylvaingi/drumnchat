Template.room.helpers({
    room: function(){
        var room = DNC.Rooms.findOne(Session.get("roomId"));

        if(!room && !Session.get("rooms.loading")){
            console.log("Unknown room, redirecting to home");
            Meteor.Router.to("/");
        }

        return room;
    },

    userCount: function(){
        return Meteor.users.find({roomId: Session.get("roomId")}).count();
    }
});