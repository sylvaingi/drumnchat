(function(){
    Meteor.methods({
        "onAirOffset": function(){
            return DNC.Tracks.playingTrack().offset;
        },
        
        "addTrack": function(url){
            console.log("Received SC URL '"+url+"'");
            DNC.Tracks.enqueue(url, this.userId);
        }
    });
}());
