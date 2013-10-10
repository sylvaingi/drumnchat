"use strict";

var Player = {
    init: function(){
        Player.playingHandle = DNC.Tracks.find({playing: true}).observe({
            added: function(track){
                playTrack(track);
            }
        });

        Player.muted = false;
        Session.set("player.muted", Player.muted);
    },

    toggleMute: function(){
        if(Player.track){
            if(Player.track.type === "sc"){
                Player.stream.toggleMute();
            }
            else if(Player.track.type === "yt"){
                Player.ytplayer[Player.muted? "unMute": "mute"]();
            }
        }

        Player.muted = !Player.muted;
        Session.set("player.muted", Player.muted);
    },

    stop : function(){
        Player.muted = false;
        Session.set("player.muted", Player.muted);
        stopPlayback();
    }
};

function playTrack(track){
    stopPlayback();

    console.log("Playing track", track.serviceData.title, track);

    Meteor.call("onAirOffset", Session.get("roomId"), function(error,result){
        console.log("Playing track offset is "+ result + "ms");
        track._offset = result;

        Player.track = track;
        Session.set("player.track", track);

        if(track.type === "sc"){
            loadSoundcloudTrack(track);
        }
        else if(track.type === "yt"){
            loadYoutubeTrack(track);
        }
    });
}

function loadSoundcloudTrack(track){
    var opts = {
        autoPlay: true,
        position: track._offset,
        whileloading: function(){
            Player.onLoading && Player.onLoading.call(this, track);
        },
        whileplaying:function(){
            Player.onPlaying && Player.onPlaying.call(this, track);
        }
    };

    SC.stream("/tracks/"+track.serviceData.id, opts, function(stream){
        if(Player.muted){
            stream.mute();
        }

        Player.stream = stream;
    });
}

function loadYoutubeTrack(track){
    Player.ytplayer.cueVideoById(track.serviceData.id, 0, "large");
    Player.ytplayer.seekTo(track._offset / 1000);
    setYoutubeMute();
    Player.ytplayer.playVideo();    
}

function setYoutubeMute(){
    Player.ytplayer[!Player.muted? "unMute": "mute"]();
}

function stopPlayback(){
    if(Player.stream){
        Player.stream.destruct();
    }
    if(Player.ytplayer){
        Player.ytplayer.pauseVideo();
    }

    //Unregister callback only if the player was in playback mode,
    //otherwise we could unregister useful callbacks
    if(Player.playing){
        Player.onLoading = null;
        Player.onPlaying = null;
    }

    Player.track = null;
    Session.set("player.track", null);
}

//Load 3rd party players
Session.set("youtube.domready", false);
Session.set("youtube.apiready", false);
Session.set("youtube.ready", false);

Template.ytplayer.created = function(){
    Session.set("youtube.domready", true);
};

window.onYouTubeIframeAPIReady = function(playerid){
    Session.set("youtube.apiready", true);
};

Deps.autorun(function(){
    if(!Session.equals("youtube.domready", true) || !Session.equals("youtube.apiready", true)){
        return;
    }

    var ytplayer = new YT.Player("yt-player", {
      width: "640",
      height: "480",
      videoId: "",
      events: {
        "onReady": function(){
            Player.ytplayer = ytplayer;
            Player.ytplayer.setVolume(100);

            Session.set("youtube.ready", true);
        },
        "onError": function(error){
            console.log("Youtube error: ", error);
        }
      }
    });
});


Deps.autorun(function(){
    if(Session.get("youtube.ready") && Soundcloud.ready()){
        Player.init();
    }
});

Deps.autorun(function(){
    Router.current();
    Player.stop();
});

DNC.Player = Player;
