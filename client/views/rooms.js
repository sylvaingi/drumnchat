DNC.createRoom = function(roomName){
    Meteor.call("createRoom", roomName, function(error, roomId){
        if(roomId){
            DNC.joinRoom(roomId);
        }
    });
};

Template.rooms.events({
    submit: function(event, template){
        event.preventDefault();
        DNC.createRoom(template.find("input").value);
        event.currentTarget.reset();
    }
});

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