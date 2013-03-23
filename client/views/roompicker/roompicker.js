Template.roompicker.helpers({
    rooms: DNC.Rooms.find({})
});

/*DNC.createRoom = function(roomName){
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
});*/