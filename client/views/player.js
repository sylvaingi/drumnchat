(function(){
    "use strict";
    
    var Player = {
        _waveform: null,

        init: function(){
            Player._waveform = $(".waveform");
             
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
            Player._waveform.empty();
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

        var opts = optsForWaveform(track);
        opts.whileloading = _.wrap(opts.whileloading, function(whileloading){
            whileloading.call(this);
            deferPlayAtRequiredOffset.call(this, track);
        });
        opts.autoLoad = true;

        SC.stream("/tracks/"+track.sc.id, opts, function(stream){
            if(Player.muted){
                stream.mute();
            }
            
            track._loadstart = Date.now();
            Player.stream = stream;
        });
    }

    function optsForWaveform(track){
        var waveform = new Waveform({
            container: Player._waveform.empty()[0]
        });
        waveform.dataFromSoundCloudTrack(track.sc);

        var ctx = waveform.context;
        var gradient = ctx.createLinearGradient(0, 0, 0, waveform.height);
        gradient.addColorStop(0.0, "#f60");
        gradient.addColorStop(1.0, "#FF69B4");
        var streamOptions = waveform.optionsForSyncedStream({
            playedColor: gradient
        });

        return streamOptions;
    }

    function deferPlayAtRequiredOffset(track){
        if(!track._playing && track._offset!== null){
            var latencyComp = Date.now() - track._loadstart;
            if(this.duration> track._offset + latencyComp){
                console.log("Playing track caught up with offset at " + this.duration + " (comp "+latencyComp+")");

                track._playing = true;

                this.setPosition(track._offset + latencyComp);
                this.play();
            }
        } 
    }

    DNC.Player = Player;

    Template.player.helpers({
        playing:function(){
            return Session.get("DNC.Player.playing");
        },
        muted: function(){
            return Session.get("DNC.Player.muted");
        }
    });

    Template.player.events({
        "click .mute": function(event){
            event.preventDefault();
            Player.toggleMute();
        }
    });

}());
