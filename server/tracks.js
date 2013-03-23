(function(){
    "use strict";

    var Tracks = DNC.Tracks;

    Tracks.nextTrack = function(roomId){
        Tracks.stopTrack(roomId);
        var track = Tracks.findOne({roomId: roomId, playing: false}, {sort: Tracks.trackSort});

        var result = Meteor.http.get("http://api.soundcloud.com/tracks/"+track.sc.id, {
            params : {client_id: DNC.SC_clientId, format:'json'}
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

    Tracks.enqueue = function(url, userId, roomId){
        var result = Meteor.http.get("http://api.soundcloud.com/resolve", {
            params : {url:url, client_id: DNC.SC_clientId, format:'json'}
        });

        if(result.statusCode !== 200){
            throw new Meteor.Error(result.statusCode, "Unable to resolve SC URL");
        }

        if(!result.data.streamable){
            throw new Meteor.Error(400, "Unable to stream SC track, streaming is disabled");
        }

        if(roomId !== DNC.Rooms.mixesRoom && result.data.duration > 10 * 60 * 1000){
            throw new Meteor.Error(400, "Track duration is too long");
        }
        
        var track = Tracks.findOne({roomId: roomId, "sc.id":result.data.id});
        if(track){
            console.log("Track '"+result.data.title+"' is already enqueued, voting instead");
            Tracks.addVote(track._id);  

            return;
        }

        var sc = prepareCachedSCData(result.data);
        Tracks.insert({
            votes: [userId],
            playing: false,
            addedOn: new Date(),
            sc: sc,
            roomId: roomId   
        });
    };

    Tracks.stopTrack = function(roomId){
        var track = Tracks.playingTrack(roomId);
        if(!track){
            return;
        }

        var setAttrs = {
            sc: track._sc,
            votes: [],
            addedOn: new Date(),
            playing: false
        };
        Tracks.update(track._id, {$set: setAttrs, $unset:{offset: "", _sc:""}});
    };

    function prepareCachedSCData(scData){
        var sc = _.pick(scData, 'id', 'title', 'duration', 'artwork_url', 'permalink_url');
        sc.user = _.pick(scData.user, 'username', 'avatar_url', 'permalink_url');
        return sc;
    }
}());