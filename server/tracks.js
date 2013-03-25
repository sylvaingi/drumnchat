(function(){
    "use strict";
    var url = __meteor_bootstrap__.require("url");
    var leadingProtocolRegExp = new RegExp("^http(?:s)?://", "i");

    var Tracks = DNC.Tracks;

    Tracks.nextTrack = function(roomId){
        Tracks.stopTrack(roomId);

        var track = Tracks.findOne({roomId: roomId, playing: false}, {sort: Tracks.trackSort});
        Tracks.update(track._id, {$set: {playing: true, offset:0}});
    };

    Tracks.enqueue = function(trackUrl, userId, roomId){
        console.log("Adding URL "+trackUrl+" in room "+roomId);

        if (!leadingProtocolRegExp.test(trackUrl)){
            trackUrl = "http://" + trackUrl;
        }

        var parsedUrl = url.parse(trackUrl, true);

        var serviceData;
        var serviceType;
        if(_.indexOf(["www.youtube.com", "youtu.be"], parsedUrl.hostname) !== -1){
            serviceType = "yt";
            serviceData = Tracks._prepareYoutubeTrack(parsedUrl, userId, roomId);
        }
        else if(parsedUrl.hostname === "soundcloud.com"){
            serviceType = "sc";
            serviceData = Tracks._prepareSoundcloudTrack(parsedUrl, userId, roomId);
        }
        else {
            throw new Error(400, "Invalid URL");
        }

        if(roomId !== DNC.Rooms.mixesRoom && serviceData.duration > 10 * 60 * 1000){
            throw new Meteor.Error(400, "Track duration is too long");
        }
        
        var track = Tracks.findOne({roomId: roomId, type:serviceType, "data.id":serviceData.id});
        if(track){
            console.log("Track '"+serviceData.title+"' is already enqueued, voting instead");
            Tracks.addVote(track._id);  
            return;
        }

        Tracks.insert({
            type: serviceType,
            votes: [userId],
            votesCount: 1,
            playing: false,
            addedOn: new Date(),
            serviceData: serviceData,
            roomId: roomId   
        });
    };

    Tracks._prepareSoundcloudTrack = function(trackUrlObj){
        var result = Meteor.http.get("http://api.soundcloud.com/resolve", {
            params : {url:url.format(trackUrlObj), client_id: DNC.SC_clientId, format:'json'}
        });

        if(result.statusCode !== 200){
            throw new Meteor.Error(result.statusCode, "Unable to resolve SC URL");
        }

        if(!result.data.streamable){
            throw new Meteor.Error(400, "Unable to stream SC track, streaming is disabled");
        }

        var sc = _.pick(result.data, 'id', 'title', 'duration', 'artwork_url', 'permalink_url', 'waveform_url');
        sc.user = _.pick(result.data.user, 'username', 'avatar_url', 'permalink_url');

        return sc;
    };

    Tracks._prepareYoutubeTrack = function(trackUrlObj){  
        var videoId = trackUrlObj.query.v || trackUrlObj.pathname.substring(1);

        if(!videoId){
            throw new Meteor.Error(400, "No videoId specified with youtube url");
        }

        var result = Meteor.http.get("http://gdata.youtube.com/feeds/api/videos/"+videoId+"?v=2&alt=json");
        if(result.statusCode !== 200){
            console.log(result);
            throw new Meteor.Error(result.statusCode, "Unable to fetch Youtube data");
        }

        var entry = result.data.entry;
        var url = _.findWhere(entry.link, {rel: "alternate"}).href;

        var yt = {
            id: videoId,
            title: entry.title.$t,
            duration: entry.media$group.yt$duration.seconds * 1000,
            artwork_url: entry.media$group.media$thumbnail[0].url,
            permalink_url: url
        };

        return yt;
    };

    Tracks.stopTrack = function(roomId){
        var track = Tracks.playingTrack(roomId);
        if(!track){
            return;
        }

        var setAttrs = {
            votes: [],
            votesCount: 0,
            addedOn: new Date(),
            playing: false
        };
        Tracks.update(track._id, {$set: setAttrs, $unset:{offset: ""}});
    };
}());