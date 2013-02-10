_.extend(Template.player, {
    playing : function(){
        return Session.get("playing");
    },

    rendered: function(){
        var playing = Session.get("playing");
        if(!playing){
            return;
        }

        var waveform = new Waveform({
            container: this.find(".waveform")
        });

        var ctx = waveform.context;

        var gradient = ctx.createLinearGradient(0, 0, 0, waveform.height);
        gradient.addColorStop(0.0, "#f60");
        gradient.addColorStop(1.0, "#FF69B4");

        waveform.dataFromSoundCloudTrack(playing);
    }
});