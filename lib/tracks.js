(function(){
    "use strict";

    var Tracks = new Meteor.Collection("tracks");
    var trackSort = {playing: -1, votes: -1, addedOn: 1};

    Tracks.playlist = function(roomId){
        return Tracks.find({room_id: roomId}, {sort: trackSort, fields: {offset: 0}});
    };

    Tracks.playingTrack = function(roomId){
        return Tracks.findOne({room_id: roomId, playing: true});
    };

    Tracks.addVote = function(id, userId){
        var playingMatches = Tracks.find({_id: id, playing: true}).count();
        if(playingMatches > 0){
            console.log("Ignoring vote for playing track");
            return;
        }

        Tracks.update(id, {$addToSet: {votes: userId}});
    };

    DNC.Tracks = Tracks;
    Tracks.trackSort = trackSort;
}());