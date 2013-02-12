(function(){
    "use strict";
    
    var currentStream;

    function playTrack(track){
        DNC.Player.destruct();

        Meteor.call("onAirOffset", function(error,result){
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
            track._loadstart = Date.now();
            currentStream = stream;
        });
    }

    function optsForWaveform(track){
        var waveform = new Waveform({
            container: $(".waveform").empty()[0]
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

    DNC.Tracks.find({playing: true}).observe({
        added: function(track){
            playTrack(track);
            Session.set("onair", track);
        }
    });

    DNC.Player = {
        toggleMute: function(){
            currentStream.toggleMute();
        },

        destruct : function(){
            if(currentStream){
                currentStream.destruct();
            }
        }
    };

    Template.player.track = function(){
        return Session.get("onair");
    };

    Template.player.events({
        "click .mute": function(event){
            event.preventDefault();
            DNC.Player.toggleMute();
            $(event.target).toggleClass("icon-volume-off icon-volume-up");
        }
    });

}());
