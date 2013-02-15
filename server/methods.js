(function(){
    Meteor.methods({
        "onAirOffset": function(){
            return DNC.Tracks.playingTrack().offset;
        },
        
        "addTrack": function(url){
            DNC.ensureUserIsConnected();
            console.log("Received SC URL '"+url+"'");
            DNC.Tracks.enqueue(url, this.userId);
        }
    });
}());
