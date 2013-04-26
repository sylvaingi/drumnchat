"use strict";

var tickInterval = 500;

function tick(){
    DNC.Rooms.find().forEach(function(room){
        var roomId = room._id;
        if(DNC.Tracks.playlist(roomId).count() === 0){
            return;
        }

        var track = DNC.Tracks.playingTrack(roomId);

        //Load next track
        if(!track || track.offset > track.serviceData.duration){
            DNC.Tracks.nextTrack(roomId);
        }
        else {
            var now = Date.now();
            var delta = now - track.lastUpdate;

            DNC.Tracks.update(track._id, {
                $set: {lastUpdate: now},
                $inc: {offset: delta}
            });
        }

    });

    nextTick();
}

function nextTick(){
    Meteor.setTimeout(tick, tickInterval);
}

DNC.tick = tick;
