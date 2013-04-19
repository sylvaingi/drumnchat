"use strict";

var tickInterval = 1000;
var lastInterval = Date.now();

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
            DNC.Tracks.update(track._id, {$set: {offset: track.offset + now - lastInterval}});
        }

    });

    lastInterval = Date.now();
    nextTick();
}

function nextTick(){
    Meteor.setTimeout(tick, tickInterval);
}

DNC.tick = tick;
