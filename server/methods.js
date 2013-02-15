(function(){
    Meteor.methods({
        "onAirOffset": function(){
            return DNC.Tracks.playingTrack().offset;
        },

        "heartbeat": function(die){
            DNC.ensureUserIsConnected();
            console.log("User heartbeat "+this.userId+ (die? "(kill)":""));
            Meteor.users.update({_id: this.userId}, {$set: {active: die ? false : true, last_seen: (new Date()).getTime()}});
        },
        
        "addTrack": function(url){
            DNC.ensureUserIsConnected();
            console.log("Received SC URL '"+url+"'");
            DNC.Tracks.enqueue(url, this.userId);
        }
    });
}());
