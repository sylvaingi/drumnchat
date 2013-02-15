(function(){
    function ensureUserIsConnected(userId){
        if(!userId){
            throw new Meteor.Error(403, "Please authenticate with Soundcloud first.");
        }    
    }
 
    Meteor.methods({
        "onAirOffset": function(){
            return DNC.Tracks.playingTrack().offset;
        },
        
        "addTrack": function(url){
            console.log("Received SC URL '"+url+"'");
            ensureUserIsConnected(this.userId);

            DNC.Tracks.enqueue(url, this.userId);
        },

        "heartbeat": function(data){
            console.log("User heartbeat: "+ (data? data.username + " (initial)" : this.userId));

            Meteor.users.update(this.userId, {$set:{lastSeen: new Date(), active: true}});    
        }
    });
}());
