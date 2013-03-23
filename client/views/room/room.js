Template.room.helpers({
    room: function(){
        return DNC.Rooms.findOne(Session.get("roomId"));
    }
});