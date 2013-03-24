-(function(){
    "use strict";
    
    var Player = {
        init: function(){             
            DNC.Player.playingHandle = DNC.Tracks.find({playing: true}).observe({
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
        });
        
        console.log("Playing track", track.serviceData.title, track);
        if(track.type === "sc"){
            playSoundcloudTrack(track);
        }
    }

    function playSoundcloudTrack(track){
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

    Deps.autorun(function(){
        Meteor.Router.page();
        Player.stop();
    });

    window.onYouTubePlayerReady = function(playerid){
        var ytplayer = document.getElementById("yt-player");
    };

    DNC.Player = Player;

}());
