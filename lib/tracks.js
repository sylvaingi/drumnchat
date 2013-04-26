"use strict";

var Tracks = new Meteor.Collection("tracks");
var trackSort = {playing: -1, votesCount: -1, addedOn: 1};

Tracks.playlist = function(roomId){
    return Tracks.find({roomId: roomId}, {sort: trackSort, fields: {offset: 0, lastUpdate: 0}});
};

Tracks.playingTrack = function(roomId){
    return Tracks.findOne({roomId: roomId, playing: true});
};

Tracks.addVote = function(id, userId){
    var track = Tracks.findOne({_id: id});
    if(!track || track.playing || _.indexOf(track.votes, userId) !== -1){
        console.log("Invalid vote, track unknown/playing/already voted for");
    }
    else {
        Tracks.update(id, {$push: {votes: userId}, $inc:{votesCount:1}});
    }
};

DNC.Tracks = Tracks;
Tracks.trackSort = trackSort;
