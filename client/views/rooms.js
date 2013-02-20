Template.rooms.helpers({
    rooms: DNC.Rooms.find({})
});

Template.room.helpers({
    active: function(){
        return Session.equals("roomId", this._id);
    }
});

Template.room.events({
    click : function(event, template){
        event.preventDefault();
        DNC.joinRoom(this._id);
    }
});