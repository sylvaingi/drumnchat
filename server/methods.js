(function(){
    Meteor.methods({
        "onAirOffset": function(roomId){
            return DNC.Tracks.playingTrack(roomId).offset;
        },

        "heartbeat": function(die){
            DNC.ensureUserIsConnected();
            console.log("User heartbeat "+this.userId+ (die? "(kill)":""));
            
            var set = {active: true , last_seen: (new Date()).getTime()};
            if(die){
                set.active = false;
                set.roomId = null;
            }

            Meteor.users.update({_id: this.userId}, {$set: set});
        },
        
        "addTrack": function(url){
            DNC.ensureUserIsConnected();
            DNC.Tracks.enqueue(url, this.userId, Meteor.user().roomId);
        }
    });
}());
