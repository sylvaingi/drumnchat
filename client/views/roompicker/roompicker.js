Template.roompicker.helpers({
    roomsLoading: function(){
        return Session.get("rooms.loading");
    },
    rooms: DNC.Rooms.find({})
});

Template.roomTileAdd.events({
    "click a": function(event, template){
        event.preventDefault();
        template.lastNode.innerHTML = Template.roomTileAddForm();
    },

    "submit": function(event, template){
        event.preventDefault();
        var name = template.find("input").value;

        Meteor.call("createRoom", name, function(error, roomId){
            if(error){
                alert(error.reason);
                return;
            }
            Meteor.Router.to("/room/" + roomId);
        });
    }
});