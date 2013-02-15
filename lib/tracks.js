(function(){
    "use strict";

    var Tracks = new Meteor.Collection("tracks");
    var trackSort = {playing: -1, votes: -1, lastPlayed: 1};

    Tracks.playlist = function(){
        return Tracks.find({}, {sort: trackSort, fields: {offset: 0}});
    };

    Tracks.playingTrack = function(){
        return Tracks.findOne({playing: true});
    };

    Tracks.addVote = function(_id, userId){
        var playing = Tracks.playingTrack();
        if(_id === playing._id){
            console.log("Ignoring vote for playing track");
            return;
        }

        Tracks.update(_id, {$addToSet: {votes: userId}});
    };

    DNC.Tracks = Tracks;
    Tracks.trackSort = trackSort;
}());