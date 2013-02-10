(function(){
    "use strict";
    var tickInterval = 1000;

    function tick(){
        if(DNC.Tracks.playlist().count() === 0){
            console.log("No tracks in playlist");
            return;
        }

        var track = DNC.Tracks.playingTrack();

        //Load next track
        if(!track || track.offset > track.sc.duration){
            DNC.Tracks.nextTrack();

            track = DNC.Tracks.playingTrack();
            console.log("Next track is "+track.sc.title+" with "+track.votes+" votes");
        }
        else {
            DNC.Tracks.update(track._id, {$set: {offset: track.offset + 60000}});
            console.log("Tick: current track "+track.sc.title+ " offset "+track.offset);
        }

        Meteor.setTimeout(tick, tickInterval);
    }

    DNC.tick = tick;
}());