(function(){
    "use strict";
    var tickInterval = 1000;

    function tick(){
        DNC.Rooms.find().forEach(function(room){
            var roomId = room._id;
            if(DNC.Tracks.playlist(roomId).count() === 0){
                return;
            }

            var track = DNC.Tracks.playingTrack(roomId);

            //Load next track
            if(!track || track.offset > track.sc.duration){
                DNC.Tracks.nextTrack(roomId);

                track = DNC.Tracks.playingTrack(roomId);
                console.log("Next track in "+room.name+" is '"+track.sc.title+"' with "+track.votes.length+" votes");
            }
            else {
                DNC.Tracks.update(track._id, {$set: {offset: track.offset + tickInterval}});
            }

        });

        nextTick();
    }

    function nextTick(){
        Meteor.setTimeout(tick, tickInterval);
    }

    DNC.tick = tick;
}());