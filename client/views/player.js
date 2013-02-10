var playingStream;

_.extend(Template.player, {
    playing : function(){
        return Session.get("playing");
    },

    rendered: function(){
        var playing = Session.get("playing");
        if(!playing){
            return;
        }

        if(playingStream){
            playingStream.stop();
        }

        var waveform = new Waveform({
            container: this.find(".waveform")
        });
        waveform.dataFromSoundCloudTrack(playing);

        var streamOptions = waveform.optionsForSyncedStream();

        var ctx = waveform.context;
        var gradient = ctx.createLinearGradient(0, 0, 0, waveform.height);
        gradient.addColorStop(0.0, "#f60");
        gradient.addColorStop(1.0, "#FF69B4");

        streamOptions.innerColor = gradient;
        streamOptions.autoPlay = true;
        streamOptions.whileloading = _.wrap(streamOptions.whileloading, function(whileloading){
            console.log(this.bytesLoaded);
            whileloading.call(this);
        });

        SC.stream("/tracks/"+playing.id, streamOptions, function(s){
            playingStream = s;
        });
    }
});