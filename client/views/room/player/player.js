(function(){
    "use strict";
    
    var Player = {
        init: function(){             
            DNC.Player.playingHandle = DNC.Tracks.find({playing: true}).observe({
                added: function(track){
                    playTrack(track);
                    Session.set("DNC.Player.playing", track);
                }
            });
        },

        toggleMute: function(){
            Player.muted = !!!Player.muted;
            Session.set("DNC.Player.muted", Player.muted);
            Player.stream.toggleMute();
        },

        stop : function(){
            if(Player.stream){
                Player.stream.destruct();
            }
            DNC.Player.onLoading = null;
            DNC.Player.onPlaying = null;
            Session.set("DNC.Player.playing", null);
        }
    };

    function playTrack(track){
        DNC.Player.stop();

        Meteor.call("onAirOffset", Session.get("roomId"), function(error,result){
            console.log("Playing track offset is "+ result);
            track._offset = result;
        });
        
        console.log("Playing track", track.sc.title, track);

        var opts = {
            autoLoad: true,
            whileloading: function(){
                deferPlayAtRequiredOffset.call(this, track);
                DNC.Player.onLoading && DNC.Player.onLoading.call(this, track);
            },
            whileplaying:function(){
                DNC.Player.onPlaying && DNC.Player.onPlaying.call(this, track);
            }
        };

        SC.stream("/tracks/"+track.sc.id, opts, function(stream){
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

    DNC.Player = Player;

}());
