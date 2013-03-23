(function(){
    DNC.ensureUserIsConnected = function(){
        if(!Meteor.userId()){
            throw new Meteor.Error(403, "Please authenticate first.");
        }    
    };

    Meteor.methods({
        "createRoom": function(roomName){
            DNC.ensureUserIsConnected();
            if(!roomName || roomName === ""){
                throw new Meteor.Error(400, "Please give a non empty room name.");
            }

            if(DNC.Rooms.findOne({name: roomName})){
                throw new Meteor.Error(400, "Room name is already taken.");
            }

            console.log("Creating room "+roomName);

            return DNC.Rooms.insert({name: roomName});
        },

        "vote": function(id){
            DNC.ensureUserIsConnected();
            console.log("Voting for "+id);

            DNC.Tracks.addVote(id, this.userId);
        },

        postMessage: function(msg){
            DNC.ensureUserIsConnected();
            console.log("Incoming message from "+this.userId);

            DNC.Chat.insert({message: msg, date: new Date(), user_id: this.userId, room_id: Meteor.user().room_id});
        }
    });
}());
