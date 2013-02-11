(function(){
    "use strict";
    var tickInterval = 1000;

    function tick(){
        if(DNC.Tracks.playlist().count() === 0){
            console.log("No tracks in playlist");
            nextTick();
            return;
        }

        var track = DNC.Tracks.playingTrack();

        //Load next track
        if(!track || track.offset > track.sc.duration){
            DNC.Tracks.nextTrack();

            track = DNC.Tracks.playingTrack();
            console.log("Next track is '"+track.sc.title+"' with "+track.votes.length+" votes");
        }
        else {
            DNC.Tracks.update(track._id, {$set: {offset: track.offset + tickInterval}});
            console.log("Tick: current track '"+track.sc.title+ "' offset "+track.offset);
        }

        nextTick();
    }

    function nextTick(){
        Meteor.setTimeout(tick, tickInterval);
    }

    DNC.tick = tick;
}());