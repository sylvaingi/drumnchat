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

    DNC.Tracks = Tracks;
    Tracks.trackSort = trackSort;
}());