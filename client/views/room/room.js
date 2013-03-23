Template.room.helpers({
    room: function(){
        return DNC.Rooms.findOne(Session.get("roomId"));
    },

    userCount: function(){
        return Meteor.users.find({roomId: Session.get("roomId")}).count();
    }
});