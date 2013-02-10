(function(){
    "use strict";

    var Tracks = new Meteor.Collection("tracks");
    var trackSort = {playing: -1, votes: -1, lastPlayed: 1};

    Tracks.playlist = function(){
        return Tracks.find({}, {sort: trackSort, fields: {offset:0}});
    };

    Tracks.playingTrack = function(){
        return Tracks.findOne({playing: true});
    };

    Tracks.nextTrack = function(){
        Tracks.stopTrack();

        var track = Tracks.findOne({playing: false}, {sort: trackSort});

        var result = Meteor.http.get("http://api.soundcloud.com/tracks/"+track.sc.id, {
            params : {client_id: DNC.SC.client_id, format:'json'}
        });

        if(result.statusCode !== 200){
            throw new Meteor.Error(result.statusCode, "Unable to fetch SC track data");
        }

        var miniSc = prepareCachedSCData(result.data);
        var setAttrs = {
            playing: true,
            offset: 0,
            sc: result.data,
            _sc: miniSc
        };

        Tracks.update(track._id, {$set: setAttrs});
    };

    Tracks.enqueue = function(url){
        var result = Meteor.http.get("http://api.soundcloud.com/resolve", {
            params : {url:url, client_id: DNC.SC.client_id, format:'json'}
        });

        if(result.statusCode !== 200){
            throw new Meteor.Error(result.statusCode, "Unable to resolve SC URL");
        }

        var sc = prepareCachedSCData(result.data);
        Tracks.insert({
            votes: 1,
            playing: false,
            addedOn: new Date(),
            lastPlayed: new Date(0),
            sc: sc   
        });
    };

    Tracks.stopTrack = function(){
        var track = Tracks.playingTrack();
        if(!track){
            return;
        }

        var setAttrs = {
            sc: track._sc,
            votes: 0,
            lastPlayed: new Date(),
            playing: false
        };
        Tracks.update(track._id, {$set: setAttrs, $unset:{offset: "", _sc:""}});
    };

    function prepareCachedSCData(scData){
        var sc = _.pick(scData, 'id', 'title', 'duration', 'artwork_url');
        sc.user = _.pick(scData.user, 'username', 'avatar_url');
        return sc;
    }

    Tracks.addVote = function(id){
        Tracks.update(id, {$inc: {votes: 1}});
    };

    DNC.Tracks = Tracks;
}());

