(function(){
    "use strict";

    var Player = {
        init: function(){   
            Player.playingHandle = DNC.Tracks.find({playing: true}).observe({
                added: function(track){
                    playTrack(track);
                    Session.set("player.playing", track);
                }
            });
        },

        toggleMute: function(){
            Player.muted = !!!Player.muted;
            Session.set("player.muted", Player.muted);
            Player.stream.toggleMute();
        },

        stop : function(){
            if(Player.stream){
                Player.stream.destruct();
            }
            if(Player.ytplayer){
                Player.ytplayer.pauseVideo();
            }

            Player.onLoading = null;
            Player.onPlaying = null;
            Session.set("player.playing", null);
        }
    };

    function playTrack(track){
        DNC.Player.stop();

        Meteor.call("onAirOffset", Session.get("roomId"), function(error,result){
            console.log("Playing track offset is "+ result);
            track._offset = result;

            startPlayback(track);
        });
        
        console.log("Playing track", track.serviceData.title, track);
        if(track.type === "sc"){
            loadSoundcloudTrack(track);
        }
        else if(track.type === "yt"){
            loadYoutubeTrack(track);
        }
    }

    function loadSoundcloudTrack(track){
        var opts = {
            autoLoad: true,
            whileloading: function(){
                deferPlayAtRequiredOffset.call(this, track);
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
            
            track._loadstart = Date.now();
            Player.stream = stream;
        });
    }

    function deferPlayAtRequiredOffset(track){
        if(!track._playing && track._offset!== null){
            var latencyComp = Date.now() - track._loadstart;
            if(this.duration > track._offset + latencyComp){
                console.log("Playing track caught up with offset at " + this.duration + " (comp "+latencyComp+")");

                track._playing = true;

                this.setPosition(track._offset + latencyComp);
                this.play();
            }
        }
    }

    function loadYoutubeTrack(track){
        Player.ytplayer.cueVideoById(track.serviceData.id, 0, "large");
    }

    function startPlayback(track){
        if(track.type === "yt"){
            Player.ytplayer.seekTo(track._offset / 1000);
            Player.ytplayer.playVideo();
        }
    }

    //Load 3rd party players
    Session.set("soundcloud.ready", false);
    Session.set("youtube.ready", false);

    Accounts.loginServiceConfiguration
        .find({service: "soundcloud"}).observe({
            added: function(scData){
                SC.initialize({
                    client_id: scData.clientId
                });

                Session.set("soundcloud.ready", true);
            }
        });

    window.onYouTubeIframeAPIReady = function(playerid){
        var ytplayer = new YT.Player("yt-player", {
          width: "640",
          height: "480",
          videoId: "",
          events: {
            "onReady": function(){
                Player.ytplayer = ytplayer;
                Session.set("youtube.ready", true);
            },
            "onError": function(error){
                console.log("Youtube error: ", error);
            }
          }
        });
    };


    Deps.autorun(function(){
        if(Session.get("youtube.ready") && Session.get("soundcloud.ready")){
            Player.init();
        }
    });

    Deps.autorun(function(){
        Meteor.Router.page();
        Player.stop();
    });

    DNC.Player = Player;

}());
