(function(){
    "use strict";
    
    var currentStream;

    function playTrack(track){
        if(currentStream){
            currentStream.stop();
        }

        var opts = optsForWaveform(track);
        opts.whileloading = _.wrap(opts.whileloading, function(whileloading){
            deferPlayAtRequiredOffset.call(this, track);
            whileloading.call(this);
        });

        SC.stream("/tracks/"+track.sc.id, opts, function(stream){
            stream.load();
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
            currentStream.setPosition(track.offset);
            currentStream.play();
        }
    }

    var playingQuery = DNC.Tracks.find({playing:true});
    playingQuery.observe({
        added: function(track){
            Session.set("current-track", track);
            playTrack(track);
        }
    });

    Template.player.track = function(){
        return Session.get("current-track");
    };
}());
