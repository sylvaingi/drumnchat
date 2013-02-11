(function(){
    "use strict";
    
    var currentStream;

    function playTrack(track){
        DNC.Player.destruct();

        console.log("Playing ", track);

        var opts = optsForWaveform(track);
        opts.whileloading = _.wrap(opts.whileloading, function(whileloading){
            whileloading.call(this);
            deferPlayAtRequiredOffset.call(this, track);
        });
        opts.autoLoad = true;
        SC.stream("/tracks/"+track.sc.id, opts, function(stream){
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
        if(!track._playing && this.duration > track.offset){
            track._playing = true;
            this.setPosition(track.offset);
            this.play();
        }
    }

    new Meteor.Collection("onair").find().observe({
        added: function(track){
            playTrack(track);
            Session.set("onair", track);
        }
    });

    DNC.Player = {
        destruct : function(){
            if(currentStream){
                currentStream.destruct();
            }
        }
    };

    Template.player.track = function(){
        return Session.get("onair");
    };

}());
